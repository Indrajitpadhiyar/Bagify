import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { ShoppingBag, AlertCircle, CheckCircle, X } from "lucide-react";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import UserOrder from "../layouts/UserOrder";
import { getMyOrders, cancelOrder } from "../../redux/actions/order.Action";
import toast from "react-hot-toast";

const CancelPopup = ({ isOpen, onClose, onConfirm, orderId }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-5 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <AlertCircle className="w-6 h-6" /> Cancel Order
                        </h2>
                    </div>

                    <div className="p-6 space-y-4">
                        <p className="text-gray-700">
                            Are you sure you want to <span className="font-bold text-red-600">cancel</span> this order?
                        </p>
                        <p className="text-sm text-gray-500">
                            Order ID: <span className="font-mono">#{orderId?.slice(-6).toUpperCase()}</span>
                        </p>

                        <div className="flex justify-center py-4">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <X className="w-12 h-12 text-red-600" />
                                </motion.div>
                            </motion.div>
                        </div>

                        <p className="text-center text-sm text-gray-600">
                            This action <span className="font-bold">cannot be undone</span>.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-full border border-gray-300 font-medium text-sm hover:bg-gray-100"
                        >
                            Keep Order
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
                        >
                            <CheckCircle className="w-4 h-4" /> Confirm Cancel
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const MyOrder = () => {
    const dispatch = useDispatch();
    const { loading, orders = [], error } = useSelector((state) => state.myOrders || {});

    const [expandedOrder, setExpandedOrder] = useState(null);
    const [cancelPopup, setCancelPopup] = useState({ isOpen: false, orderId: null });
    const [cancellingOrderId, setCancellingOrderId] = useState(null);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const toggleExpand = (orderId) => {
        setExpandedOrder((prev) => (prev === orderId ? null : orderId));
    };

    const openCancelPopup = (orderId) => {
        setCancelPopup({ isOpen: true, orderId });
    };

    const closeCancelPopup = () => {
        setCancelPopup({ isOpen: false, orderId: null });
    };

    const confirmCancel = async () => {
        const orderId = cancelPopup.orderId;
        setCancellingOrderId(orderId);
        closeCancelPopup();

        try {
            await dispatch(cancelOrder(orderId));
            toast.success("Order cancelled successfully!");
        } catch {
            toast.error("Failed to cancel order. Please try again.");
        } finally {
            setTimeout(() => setCancellingOrderId(null), 600);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <Footer />
            </>
        );
    }

    if (orders.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center max-w-md">
                        <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-700 mb-3">No orders yet</h2>
                        <p className="text-gray-500 mb-8">Your orders will appear here once you place one.</p>
                        <button
                            onClick={() => (window.location.href = "/products")}
                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105"
                        >
                            Start Shopping
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // FILTER: Remove cancelled + currently cancelling orders
    const activeOrders = orders
        .filter((order) => order.orderStatus !== "Cancelled")
        .filter((order) => order._id !== cancellingOrderId);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
                <div className="w-full max-w-4xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-center mb-12 text-orange-800"
                    >
                        My Orders
                    </motion.h1>

                    <motion.div className="space-y-8">
                        <AnimatePresence>
                            {activeOrders.map((order) => (
                                <UserOrder
                                    key={order._id}
                                    order={order}
                                    isCancelling={cancellingOrderId === order._id}
                                    onCancelClick={openCancelPopup}
                                    onToggleExpand={toggleExpand}
                                    isExpanded={expandedOrder === order._id}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
            <Footer />

            <CancelPopup
                isOpen={cancelPopup.isOpen}
                onClose={closeCancelPopup}
                onConfirm={confirmCancel}
                orderId={cancelPopup.orderId}
            />
        </>
    );
};

export default MyOrder;