import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, updateOrder, clearErrors } from "../../redux/actions/order.Action";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Truck, Calendar, MapPin, CreditCard, Package, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import socket from "../../utils/socket.js";
import toast from "react-hot-toast";

const AdminOrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, error, order } = useSelector((state) => state.orderDetails);
    const { error: updateError, isUpdated } = useSelector((state) => state.order);

    const [status, setStatus] = useState("");

    useEffect(() => {
        dispatch(getOrderDetails(id));

        // Join socket room
        socket.emit("join_order", id);

        // Listen for real-time updates (e.g. if user cancels)
        socket.on("order_status_update", (data) => {
            dispatch(getOrderDetails(id));
            toast.success("Order updated externally!");
        });

        return () => {
            socket.off("order_status_update");
        }
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
            toast.success("Order Updated Successfully");
            dispatch({ type: "UPDATE_ORDER_RESET" });
            dispatch(getOrderDetails(id)); // Refetch to be sure
        }
    }, [dispatch, error, updateError, isUpdated, id]);

    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("status", status);
        dispatch(updateOrder(id, myForm));
    };

    const statusOptions = ["Processing", "Shipped", "Delivered"];

    if (loading || !order) {
        return <div className="p-8 text-center">Loading Order Details...</div>;
    }

    return (
        <div className="space-y-6">
            <Link to="/admin/orders" className="flex items-center text-gray-500 hover:text-orange-600 transition mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
            </Link>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Order Info */}
                <div className="flex-1 space-y-6">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Placed on {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold 
                                ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                {order.orderStatus}
                            </span>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-orange-500" /> Order Items
                        </h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item) => (
                                <div key={item._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">Product ID: {item.product}</p>
                                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-lg font-bold">
                            <span>Total Amount</span>
                            <span className="text-orange-600">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Shipping & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" /> Shipping Info
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">{order.user?.name}</p>
                                <p>{order.shippingInfo.address}</p>
                                <p>{order.shippingInfo.city}, {order.shippingInfo.state}</p>
                                <p>{order.shippingInfo.country} - {order.shippingInfo.pinCode}</p>
                                <p className="mt-2 text-gray-500">Phone: {order.shippingInfo.phoneNo}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" /> Payment Info
                            </h3>
                            <div className="text-sm text-gray-600 space-y-2">
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="text-green-600 font-medium">PAID</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Method:</span>
                                    <span>Online / Card</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    TxID: {order.paymentInfo.id}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Timeline */}
                <div className="w-full lg:w-80 space-y-6">
                    {/* Status Update */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Update Status</h3>
                        {order.orderStatus === "Delivered" ? (
                            <div className="text-center p-4 bg-green-50 rounded-xl text-green-700 text-sm font-medium">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                                Order Delivered
                            </div>
                        ) : order.orderStatus === "Cancelled" ? (
                            <div className="text-center p-4 bg-red-50 rounded-xl text-red-700 text-sm font-medium">
                                Order Cancelled
                            </div>
                        ) : (
                            <form onSubmit={updateOrderSubmitHandler} className="space-y-4">
                                <div>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="">Choose Status</option>
                                        {statusOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || status === ""}
                                    className="w-full py-2.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Update Status
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-800 mb-4">Order Timeline</h3>
                        <div className="relative pl-4 border-l-2 border-gray-200 space-y-6">
                            {order.timeline && order.timeline.slice().reverse().map((event, index) => (
                                <div key={index} className="relative">
                                    <div className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full border-2 border-white 
                                        ${index === 0 ? 'bg-orange-500 ring-2 ring-orange-200' : 'bg-gray-300'}`} />
                                    <p className="text-sm font-medium text-gray-800">{event.status}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{new Date(event.timestamp).toLocaleString()}</p>
                                    {event.message && <p className="text-xs text-gray-600 mt-1 italic">"{event.message}"</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
