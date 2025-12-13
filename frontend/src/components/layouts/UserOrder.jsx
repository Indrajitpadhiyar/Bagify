import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { MapPin, ChevronDown, ChevronUp, X } from "lucide-react";
import FancyDeliveryStatus from "../ui/FancyDeliveryStatus";
import socket from "../../utils/socket.js";

const UserOrder = ({
    order,
    isCancelling,
    onCancelClick,
    onToggleExpand,
    isExpanded,
}) => {
    const [status, setStatus] = useState(order.orderStatus);
    const [timeline, setTimeline] = useState(order.timeline || []);

    useEffect(() => {
        // Listen for specific order updates
        socket.emit("join_order", order._id);

        const handleUpdate = (data) => {
            console.log("Socket Update Received:", data);
            setStatus(data.status);
            if (data.timeline) setTimeline(data.timeline);
        };

        socket.on("order_status_update", handleUpdate);

        return () => {
            socket.off("order_status_update", handleUpdate);
        };
    }, [order._id]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
                scale: 0.9,
                opacity: 0,
                x: -100,
                transition: { duration: 0.4, ease: "easeInOut" },
            }}
            key={order._id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
        >
            <div className={`bg-gradient-to-r ${status === 'Cancelled' ? 'from-red-500 to-rose-600' : 'from-orange-500 to-orange-600'} text-white p-5 md:p-6 transition-colors duration-500`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <p className="text-sm opacity-90">Order ID</p>
                        <p className="text-lg md:text-xl font-bold">
                            #{order._id.slice(-6).toUpperCase()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-90">Total</p>
                        <p className="text-xl md:text-2xl font-bold">
                            ₹{order.totalPrice.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs opacity-75 mt-1">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5 md:p-6 space-y-4">
                {order.orderItems.slice(0, 2).map((item) => (
                    <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-orange-900 truncate text-sm md:text-base">
                                {item.name}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600">
                                Qty: {item.quantity}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-orange-900 text-sm md:text-base">
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>
                ))}
                {order.orderItems.length > 2 && (
                    <p className="text-center text-sm text-gray-500">
                        + {order.orderItems.length - 2} more items
                    </p>
                )}
            </div>

            <div className="border-t border-gray-200 p-5 md:p-6 bg-gray-50">
                <div className="space-y-6">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">
                                Delivery Address
                            </p>
                            <p className="text-xs md:text-sm text-gray-700 mt-0.5">
                                <span className="font-medium">{order.shippingInfo.name}</span> •{" "}
                                {order.shippingInfo.phoneNo}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                                {order.shippingInfo.state} - {order.shippingInfo.pinCode}
                            </p>
                        </div>
                    </div>

                    <div>
                        <FancyDeliveryStatus status={status} />
                    </div>

                    <div className="flex justify-between items-center">
                        {status === "Processing" && (
                            <motion.button
                                disabled={isCancelling}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onCancelClick(order._id)}
                                className="px-5 py-2 bg-red-100 text-red-600 rounded-full font-medium text-sm hover:bg-red-200 transition flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <X className="w-4 h-4" />{" "}
                                {isCancelling ? "Cancelling…" : "Cancel Order"}
                            </motion.button>
                        )}

                        <button
                            onClick={() => onToggleExpand(order._id)}
                            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium transition ml-auto"
                        >
                            {isExpanded ? (
                                <>
                                    Hide Details <ChevronUp className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    View Details <ChevronDown className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 bg-white overflow-hidden"
                    >
                        <div className="p-5 md:p-6 space-y-5">
                            {/* Timeline View */}
                            {timeline.length > 0 && (
                                <div className="mb-6 pb-6 border-b border-gray-100">
                                    <h4 className="font-semibold text-gray-800 mb-4">Tracking History</h4>
                                    <div className="space-y-4 pl-2">
                                        {timeline.slice().reverse().map((event, idx) => (
                                            <div key={idx} className="flex gap-3 relative">
                                                {idx !== timeline.length - 1 && (
                                                    <div className="absolute left-[5px] top-2 h-full w-0.5 bg-gray-200" />
                                                )}
                                                <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 z-10 ${idx === 0 ? 'bg-orange-500' : 'bg-gray-300'}`} />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{event.status}</p>
                                                    <p className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
                                                    {event.message && <p className="text-xs text-gray-600 mt-0.5">{event.message}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3">All Items</h4>
                                <div className="space-y-3">
                                    {order.orderItems.map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-14 h-14 object-cover rounded-md"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    ₹{item.price} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-orange-600">
                                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-gray-800 mb-3">
                                    Price Breakdown
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Items Price</span>
                                        <span>₹{order.itemsPrice.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>₹{order.taxPrice.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>₹{order.shippingPrice.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                        <span>Total</span>
                                        <span className="text-orange-600">
                                            ₹{order.totalPrice.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-green-800">
                                    Payment: Cash on Delivery
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    ID: {order.paymentInfo.id}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default UserOrder;