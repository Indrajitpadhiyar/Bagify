// src/components/ui/FancyDeliveryStatus.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Truck, Package, CheckCircle, Clock, X } from "lucide-react";

const FancyDeliveryStatus = ({ status = "Processing" }) => {
    const [progress, setProgress] = useState(0);

    const statusConfig = {
        Processing: { progress: 0.3, color: "yellow", icon: Clock, label: "Packing" },
        Shipped: { progress: 0.7, color: "orange", icon: Truck, label: "On the Way" },
        Delivered: { progress: 1, color: "green", icon: CheckCircle, label: "Delivered" },
        Cancelled: { progress: 0, color: "red", icon: X, label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.Processing;

    useEffect(() => {
        setProgress(config.progress);
    }, [status, config.progress]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-full bg-${config.color}-100`}>
                        <config.icon className={`w-5 h-5 text-${config.color}-600`} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <p className={`text-lg font-bold text-${config.color}-700`}>{config.label}</p>
                    </div>
                </div>

                {/* Subtle Pulse Icon */}
                <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-3xl"
                >
                    {status === "Processing" && "📦"}
                    {status === "Shipped" && "🚚"}
                    {status === "Delivered" && "🎉"}
                    {status === "Cancelled" && "❌"}
                </motion.div>
            </div>

            {/* Minimal Animation Scene */}
            <div className="h-32 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex items-center justify-center relative overflow-hidden">
                {/* Processing: Box with Tape */}
                {status === "Processing" && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-16 h-16 bg-orange-500 rounded-lg  flex items-center justify-center">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="h-1 bg-yellow-400 rounded-full mt-2 w-20"
                        />
                    </motion.div>
                )}
                {/* Shipped: Truck Moving */}
                {status === "Shipped" && (
                    <motion.div
                        initial={{ x: -100 }}
                        animate={{ x: 100 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-20 h-12 bg-orange-600 rounded-lg relative">
                            <div className="absolute top-1 left-1 w-8 h-6 bg-orange-700 rounded" />
                            <div className="absolute bottom-1 left-3 w-5 h-5 bg-gray-800 rounded-full" />
                            <div className="absolute bottom-1 right-3 w-5 h-5 bg-gray-800 rounded-full" />
                        </div>
                    </motion.div>
                )}

                {/* Delivered: Checkmark Pop */}
                {status === "Delivered" && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                )}

                {/* Cancelled: Cross */}
                {status === "Cancelled" && (
                    <motion.div
                        animate={{ rotate: [0, 45, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-6xl text-red-600"
                    >
                        <X className="w-16 h-16" />
                    </motion.div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Placed</span>
                    <span>Transit</span>
                    <span>Done</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r from-${config.color}-400 to-${config.color}-600`}
                    />
                </div>
            </div>

            {/* Final Message */}
            <p className="mt-3 text-center text-sm font-medium text-gray-700">
                {status === "Processing" ? "We're packing your order" :
                    status === "Shipped" ? "Your package is on the way" :
                        status === "Delivered" ? "Enjoy your purchase!" : "Order cancelled"}
            </p>
        </motion.div>
    );
};

export default FancyDeliveryStatus;