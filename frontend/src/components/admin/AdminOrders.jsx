import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, clearErrors, updateParams } from "../../redux/actions/order.Action";
import { Link } from "react-router-dom";
import { Eye, Trash2, SlidersHorizontal, ArrowUpDown, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../../utils/socket";
import toast from "react-hot-toast";
import FancyDeliveryStatus from "../ui/FancyDeliveryStatus";

const AdminOrders = () => {
    const dispatch = useDispatch();
    const { loading, error, orders, totalAmount } = useSelector((state) => state.allOrders);

    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [newOrderIds, setNewOrderIds] = useState([]);

    useEffect(() => {
        dispatch(getAllOrders());

        // Listen for new orders
        socket.on("new_order", (order) => {
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <Bell className="h-10 w-10 text-orange-500" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">New Order Received!</p>
                                <p className="mt-1 text-sm text-gray-500">Order #{order._id.slice(-6).toUpperCase()} - ₹{order.totalPrice}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ));
            setNewOrderIds((prev) => [order._id, ...prev]);
            dispatch(getAllOrders()); // Refresh list
        });

        // Listen for status updates (if another admin updates)
        socket.on("order_status_update", () => {
            dispatch(getAllOrders());
        });

        return () => {
            socket.off("new_order");
            socket.off("order_status_update");
        }
    }, [dispatch]);

    const filteredOrders = orders && orders.filter(order => {
        const matchesStatus = filterStatus === "All" || order.orderStatus === filterStatus;
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusColors = {
        Processing: "bg-yellow-100 text-yellow-800",
        Shipped: "bg-blue-100 text-blue-800",
        Delivered: "bg-green-100 text-green-800",
        Cancelled: "bg-red-100 text-red-800",
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Total Revenue: <span className="font-bold text-green-600">₹{totalAmount?.toLocaleString('en-IN') || 0}</span>
                    </p>
                </div>

                <div className="flex gap-2">
                    <select
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by Order ID or User Name..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                    <Eye className="w-5 h-5" />
                </div>
            </div>

            {/* Orders Data Table or Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Items Qty</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence>
                                {filteredOrders && filteredOrders.map((order) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`hover:bg-gray-50 transition-colors ${newOrderIds.includes(order._id) ? 'bg-orange-50' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-gray-700">#{order._id.slice(-6).toUpperCase()}</span>
                                            {newOrderIds.includes(order._id) && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                    New
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {order.orderItems.length}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹{order.totalPrice.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/admin/order/${order._id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition mr-2">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {(!filteredOrders || filteredOrders.length === 0) && (
                    <div className="p-8 text-center text-gray-500">
                        No orders found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
