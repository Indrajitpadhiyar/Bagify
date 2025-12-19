import React, { useEffect, useState  } from "react";
import { useSelector,useDispatch } from "react-redux";
import {
    getOrderDetails,
    updateOrder,
    clearErrors,
} from "../../redux/actions/order.Action";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Truck,
    Calendar,
    MapPin,
    CreditCard,
    Package,
    CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import socket from "../../utils/socket.js";
import toast from "react-hot-toast";

const AdminOrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, error, order } = useSelector((state) => state.orderDetails);
    const { error: updateError, isUpdated } = useSelector((state) => state.order);

    const [status, setStatus] = useState("");

    // Logical status flow: Processing → Shipped → Delivered (or Cancel at any time before Delivered)
    const getAvailableStatuses = (currentStatus) => {
        if (currentStatus === "Delivered" || currentStatus === "Cancelled") {
            return [];
        }

        const flow = ["Processing", "Shipped", "Delivered"];
        const currentIndex = flow.indexOf(currentStatus);

        let options = ["Cancelled"]; // Always allow cancel before delivery

        if (currentIndex !== -1) {
            options = options.concat(flow.slice(currentIndex + 1));
        } else {
            options = options.concat(flow.slice(1)); // fallback
        }

        return options;
    };

    useEffect(() => {
        dispatch(getOrderDetails(id));

        socket.emit("join_order", id);

        socket.on("order_status_update", (data) => {
            dispatch(getOrderDetails(id));
            toast.success("Order status updated in real-time!");
        });

        return () => {
            socket.off("order_status_update");
            socket.emit("leave_order", id);
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (order) {
            setStatus(order.orderStatus);
        }
    }, [order]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        if (updateError) {
            toast.error(updateError);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            toast.success("Order Status Updated Successfully!");
            dispatch({ type: "UPDATE_ORDER_RESET" });
            dispatch(getOrderDetails(id));
        }
    }, [dispatch, error, updateError, isUpdated, id]);

    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();
        if (!status || status === order.orderStatus) {
            toast.error("Please select a different status");
            return;
        }
        const myForm = new FormData();
        myForm.set("status", status);
        dispatch(updateOrder(id, myForm));
    };

    if (loading || !order) {
        return (
            <div className="p-8 text-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-gray-600">Loading Order Details...</p>
            </div>
        );
    }

    const availableStatuses = getAvailableStatuses(order.orderStatus);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <Link
                    to="/admin/orders"
                    className="inline-flex items-center text-gray-500 hover:text-orange-600 transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Orders
                </Link>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Header */}
                        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-5 py-2 rounded-full text-sm font-bold 
                  ${order.orderStatus === "Delivered"
                                            ? "bg-green-100 text-green-700"
                                            : order.orderStatus === "Cancelled"
                                                ? "bg-red-100 text-red-700"
                                                : order.orderStatus === "Shipped"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-orange-500" /> Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item) => (
                                    <div
                                        key={item.product}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-gray-900">
                                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-200 flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span className="text-orange-600">
                                    ₹{order.totalPrice.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>

                        {/* Shipping & Payment */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gray-400" /> Shipping Address
                                </h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p className="font-medium text-gray-900">{order.user?.name}</p>
                                    <p>{order.shippingInfo.address}</p>
                                    <p>
                                        {order.shippingInfo.city}, {order.shippingInfo.state} -{" "}
                                        {order.shippingInfo.pinCode}
                                    </p>
                                    <p>{order.shippingInfo.country}</p>
                                    <p className="mt-3">Phone: {order.shippingInfo.phoneNo}</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-gray-400" /> Payment Info
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>Status</span>
                                        <span className="text-green-600 font-bold">PAID</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Method</span>
                                        <span>Online Payment</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-3">
                                        Transaction ID: {order.paymentInfo?.id || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Actions & Timeline */}
                    <div className="space-y-6">
                        {/* Status Update - ADMIN ONLY */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
                            <h3 className="font-semibold text-gray-800 mb-4">Update Order Status</h3>

                            {order.orderStatus === "Delivered" ? (
                                <div className="text-center py-8 bg-green-50 rounded-xl">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
                                    <p className="text-green-700 font-medium">Order Delivered</p>
                                </div>
                            ) : order.orderStatus === "Cancelled" ? (
                                <div className="text-center py-8 bg-red-50 rounded-xl">
                                    <p className="text-red-700 font-medium">Order Cancelled</p>
                                </div>
                            ) : availableStatuses.length > 0 ? (
                                <form onSubmit={updateOrderSubmitHandler} className="space-y-4">
                                    <select
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        required
                                    >
                                        <option value={order.orderStatus} disabled>
                                            Current: {order.orderStatus}
                                        </option>
                                        {availableStatuses.map((opt) => (
                                            <option key={opt} value={opt}>
                                                → {opt}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition disabled:opacity-60"
                                    >
                                        {loading ? "Updating..." : "Update Status"}
                                    </button>
                                </form>
                            ) : (
                                <p className="text-gray-500 text-center">No further updates possible</p>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-5">Order Timeline</h3>
                            <div className="space-y-6 relative before:absolute before:left-5 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
                                {order.timeline?.slice().reverse().map((event, idx) => (
                                    <div key={idx} className="relative pl-12">
                                        <div className="absolute left-3 top-1 w-4 h-4 bg-orange-500 rounded-full ring-4 ring-white" />
                                        <p className="font-medium text-gray-800">{event.status}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </p>
                                        {event.message && (
                                            <p className="text-xs text-gray-600 italic mt-1">"{event.message}"</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminOrderDetails;