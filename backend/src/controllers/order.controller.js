import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import ErrorHandler from "../utils/error.handler.js";
import catchAsyncError from "../middlewares/catchAysncerror.middleware.js";
import { io } from "../../server.js";

// Create new order
export const newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Check stock and deduct
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new ErrorHandler(`Product not found with id: ${item.product}`, 404));
    }
    if (product.stock < item.quantity) {
      return next(new ErrorHandler(`Insufficient stock for product: ${product.name}`, 400));
    }
    product.stock -= item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
    timeline: [
      {
        status: "Processing",
        message: "Order placed successfully",
        timestamp: Date.now(),
      },
    ],
  });

  // Emit New Order Event
  io.emit("new_order", order);

  res.status(201).json({
    success: true,
    order,
  });
});

// Get single order details
export const getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged-in user's orders
export const myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders -- Admin
export const getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    totalOrders: orders.length,
    orders,
  });
});

// Update order status -- Admin
export const updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  // Restore stock when status becomes "Cancelled" (Admin action)
  if (req.body.status === "Cancelled" && order.orderStatus !== "Cancelled") {
    for (const item of order.orderItems) {
      await updateStockReverse(item.product, item.quantity);
    }
    order.cancelledAt = Date.now();
  }

  // If status is Delivered, just set the date
  if (req.body.status === "Delivered" && order.orderStatus !== "Delivered") {
    order.deliveredAt = Date.now();
  }

  order.orderStatus = req.body.status;

  // Add to timeline
  order.timeline.push({
    status: req.body.status,
    message: `Order status updated to ${req.body.status}`,
    timestamp: Date.now(),
  });

  await order.save({ validateBeforeSave: false });

  // Emit Status Update
  io.to(order._id.toString()).emit("order_status_update", {
    status: order.orderStatus,
    timeline: order.timeline,
  });

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
  });
});

// Helper: Decrease stock when order is Delivered
async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error(`Product not found: ${productId}`);
  }
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Helper: Increase stock when order is Cancelled
async function updateStockReverse(productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) {
    console.warn(`Product not found during cancellation: ${productId}`);
    return; // Don't crash if product was deleted
  }
  product.stock += quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete order -- Admin
export const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

// Cancel Order -- User (Only before delivery)
export const cancelOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  // Check if the logged-in user is the owner
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You can only cancel your own orders", 403));
  }

  // Prevent cancellation if already delivered or cancelled
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Delivered orders cannot be cancelled", 400));
  }

  if (order.orderStatus === "Cancelled") {
    return next(new ErrorHandler("Order is already cancelled", 400));
  }

  // Update status
  order.orderStatus = "Cancelled";
  order.cancelledAt = Date.now();

  order.timeline.push({
    status: "Cancelled",
    message: "Order cancelled by user",
    timestamp: Date.now(),
  });

  // Return items to stock
  for (const item of order.orderItems) {
    await updateStockReverse(item.product, item.quantity);
  }

  await order.save({ validateBeforeSave: false });

  // Emit Cancel Update (Reuse update event or new one)
  io.to(order._id.toString()).emit("order_status_update", {
    status: "Cancelled",
    timeline: order.timeline,
  });

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully and items returned to stock",
  });
});
