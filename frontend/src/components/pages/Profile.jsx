import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    LogOut,
    Shield,
    Home,
    User,
    ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logout, clearErrors } from "../../redux/actions/user.Action";
import {
    getMyOrders,
    getAllOrders,
    clearErrors as clearOrderErrors,
} from "../../redux/actions/order.Action";
import ProfileSettings from "../layouts/ProfileSettings";
import AdminOverview from "../admin/AdminOverview";
import AdminOrders from "../admin/AdminOrders"; // Full admin order management
import toast from "react-hot-toast";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated, error } = useSelector((state) => state.user);
    const { loading: myOrdersLoading, orders: myOrders = [] } = useSelector((state) => state.myOrders || {});
    const { loading: allOrdersLoading, orders: allOrders = [] } = useSelector((state) => state.allOrders || {});

    const [activeSection, setActiveSection] = useState("profile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isAdmin = user?.role === "admin";

    // Redirect if not authenticated
    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [error, dispatch]);

    // Fetch appropriate orders when "orders" section is active
    useEffect(() => {
        if (activeSection === "orders") {
            if (isAdmin) {
                dispatch(getAllOrders());
            } else {
                dispatch(getMyOrders());
            }
        }
    }, [activeSection, isAdmin, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully!");
        navigate("/");
    };

    // Navigation items
    const navItems = [
        { id: "home", label: "Home", icon: <Home size={20} />, href: "/" },
        { id: "profile", label: "Profile Settings", icon: <User size={20} /> },
        {
            id: "orders",
            label: isAdmin ? "All Orders" : "My Orders",
            icon: <ShoppingBag size={20} />,
        },
        ...(isAdmin
            ? [{ id: "admin", label: "Dashboard", icon: <Shield size={20} /> }]
            : []),
    ];

    // Preview of recent orders for regular users
    const UserOrdersPreview = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">My Orders</h3>
                <span className="text-sm text-gray-500">{myOrders.length} order{myOrders.length !== 1 ? 's' : ''}</span>
            </div>

            {myOrdersLoading ? (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
            ) : myOrders.length > 0 ? (
                <div className="space-y-4">
                    {myOrders.slice(0, 6).map((order, index) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-900">
                                        #{order._id.slice(-8).toUpperCase()}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''} • {order.orderItems.map(i => i.name).join(", ").slice(0, 50)}...
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-orange-600">
                                        ₹{order.totalPrice.toLocaleString('en-IN')}
                                    </p>
                                    <span className={`mt-2 inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${order.orderStatus === "Delivered" ? "bg-green-100 text-green-700" :
                                        order.orderStatus === "Cancelled" ? "bg-red-100 text-red-700" :
                                            order.orderStatus === "Shipped" ? "bg-blue-100 text-blue-700" :
                                                "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                </div>
            )}

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile/orders")}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
            >
                View All My Orders →
            </motion.button>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            {/* Header */}
            <motion.header
                initial={{ y: -60 }}
                animate={{ y: 0 }}
                className="bg-white/90 backdrop-blur-md shadow-md py-5 px-6 border-b border-gray-100 sticky top-0 z-40"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="text-center flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Account</h1>
                        <p className="text-gray-600 mt-1">Welcome back, {user?.name?.split(" ")[0]}!</p>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-3 hover:bg-gray-100 rounded-full"
                    >
                        <User size={26} />
                    </button>
                </div>
            </motion.header>

            <div className="flex relative">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-80 bg-white shadow-2xl border-r border-gray-100 min-h-screen">
                    <div className="p-8 text-center border-b border-gray-100">
                        {user?.avatar?.url ? (
                            <img
                                src={user.avatar.url}
                                alt={user.name}
                                className="w-28 h-28 rounded-full mx-auto object-cover ring-8 ring-orange-100 shadow-xl"
                            />
                        ) : (
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-5xl font-bold mx-auto ring-8 ring-orange-100">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        )}
                        <h2 className="mt-6 text-2xl font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-gray-600 mt-1">{user?.email}</p>
                        {isAdmin && (
                            <span className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-full text-sm font-bold">
                                <Shield size={16} /> Admin Access
                            </span>
                        )}
                    </div>

                    <nav className="p-6 space-y-3">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.href) navigate(item.href);
                                    else setActiveSection(item.id);
                                }}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-left font-medium transition-all duration-300 ${activeSection === item.id
                                    ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 shadow-md border border-orange-200"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 mt-10 px-6 py-4 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-xl font-bold hover:from-red-100 hover:to-red-200 transition-all shadow-sm"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </nav>
                </aside>

                {/* Mobile Sidebar */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                            />
                            <motion.aside
                                initial={{ x: -320 }}
                                animate={{ x: 0 }}
                                exit={{ x: -320 }}
                                className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
                            >
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-900">My Account</h2>
                                        <button
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="text-center">
                                        {user?.avatar?.url ? (
                                            <img src={user.avatar.url} alt={user.name} className="w-20 h-20 rounded-full mx-auto ring-4 ring-orange-200" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-3xl font-bold flex items-center justify-center mx-auto ring-4 ring-orange-200">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <h3 className="mt-4 font-bold text-gray-900">{user?.name}</h3>
                                        <p className="text-sm text-gray-600">{user?.email}</p>
                                        {isAdmin && <span className="mt-2 inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Admin</span>}
                                    </div>
                                </div>
                                <nav className="p-4 space-y-2">
                                    {navItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                if (item.href) navigate(item.href);
                                                else setActiveSection(item.id);
                                                setIsSidebarOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left font-medium ${activeSection === item.id
                                                ? "bg-orange-100 text-orange-700"
                                                : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-red-600 font-medium hover:bg-red-50"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </nav>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 min-h-[70vh]"
                        >
                            {/* Profile Settings */}
                            {activeSection === "profile" && <ProfileSettings />}

                            {/* Orders Section */}
                            {activeSection === "orders" && (
                                <>
                                    {isAdmin ? (
                                        <AdminOrders />
                                    ) : (
                                        <UserOrdersPreview />
                                    )}
                                </>
                            )}

                            {/* Admin Dashboard */}
                            {activeSection === "admin" && isAdmin && <AdminOverview />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-40">
                <div className="flex justify-around py-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex flex-col items-center text-gray-700"
                    >
                        <User size={24} />
                        <span className="text-xs mt-1">Account</span>
                    </button>
                    <button
                        onClick={() => setActiveSection("orders")}
                        className={`flex flex-col items-center ${activeSection === "orders" ? "text-orange-600" : "text-gray-700"}`}
                    >
                        <ShoppingBag size={24} />
                        <span className="text-xs mt-1">Orders</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex flex-col items-center text-red-600"
                    >
                        <LogOut size={24} />
                        <span className="text-xs mt-1">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;