import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    LogOut,
    Shield,
    Home,
    User,
    ShoppingBag,
    PackagePlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logout, clearErrors } from "../../redux/actions/user.Action";
import ProfileSettings from "../layouts/ProfileSettings";
import AddProduct from "../../admin/AddProduct";
import toast from "react-hot-toast";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated, error } = useSelector((state) => state.user);

    const [activeSection, setActiveSection] = useState("profile");

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthenticated && isAuthenticated !== null) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    // Show error toast
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [error, dispatch]);

    const isAdmin = user?.role === "admin";

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully!");
        navigate("/");
    };

    // NAVIGATION ITEMS — "Add Product" only for Admin
    const navItems = [
        { id: "home", label: "Home", icon: <Home size={20} />, href: "/" },
        { id: "profile", label: "Profile", icon: <User size={20} /> },
        {
            id: "orders",
            label: isAdmin ? "All Orders" : "My Orders",
            icon: <ShoppingBag size={20} />,
        },
        // ADD PRODUCT — ONLY FOR ADMIN
        ...(isAdmin
            ? [
                {
                    id: "add-product",
                    label: "Add Product",
                    icon: <PackagePlus size={20} />,
                },
            ]
            : []),
        // Admin Panel
        ...(isAdmin
            ? [{ id: "admin", label: "Admin Panel", icon: <Shield size={20} /> }]
            : []),
    ];

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
    };
    const child = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
    };

    // Dummy Orders (Replace with real data later)
    const OrdersSection = () => (
        <motion.div variants={child} className="space-y-5">
            <h3 className="text-2xl font-bold text-orange-900">
                {isAdmin ? "All Orders" : "My Orders"}
            </h3>
            {[
                { id: "ORD123", date: "Oct 28, 2025", total: "₹2,499", status: "Delivered", color: "green" },
                { id: "ORD124", date: "Oct 15, 2025", total: "₹1,299", status: "Shipped", color: "orange" },
                { id: "ORD125", date: "Oct 10, 2025", total: "₹799", status: "Processing", color: "yellow" },
            ].map((order, i) => (
                <motion.div
                    key={order.id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl border border-orange-200 p-5 flex justify-between items-center shadow-sm"
                >
                    <div>
                        <p className="font-bold text-orange-900">#{order.id}</p>
                        <p className="text-sm text-orange-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-orange-900">{order.total}</p>
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${order.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Shipped"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {order.status}
                        </span>
                    </div>
                </motion.div>
            ))}
            <button
                onClick={() => navigate("/orders")}
                className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium py-3 rounded-lg border border-orange-300 transition"
            >
                View All Orders →
            </button>
        </motion.div>
    );

    // Admin Dashboard Preview
    const AdminDashboard = () => (
        <motion.div variants={child} className="space-y-6">
            <h3 className="text-2xl font-bold text-orange-900">Admin Dashboard</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Orders", value: 156, color: "orange" },
                    { label: "Completed", value: 132, color: "green" },
                    { label: "Pending", value: 18, color: "yellow" },
                    { label: "Revenue", value: "₹4.8L", color: "blue" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-xl border border-orange-200 p-5 text-center shadow-md"
                    >
                        <p className="text-3xl font-bold text-orange-600">{stat.value}</p>
                        <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
            <button
                onClick={() => navigate("/admin/dashboard")}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition"
            >
                Open Full Admin Panel
            </button>
        </motion.div>
    );

    // Desktop Sidebar
    const Sidebar = () => (
        <motion.aside
            initial="hidden"
            animate="visible"
            variants={container}
            className="hidden lg:flex flex-col w-80 bg-white shadow-2xl border-r border-orange-100"
        >
            <div className="p-8 text-center border-b border-orange-100">
                {user?.avatar?.url ? (
                    <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-orange-200 shadow-lg"
                    />
                ) : (
                    <UserAvatar user={user} />
                )}
                <h2 className="mt-4 text-xl font-bold text-orange-900">{user?.name || "User"}</h2>
                <p className="text-orange-600">{user?.email}</p>
                {isAdmin && (
                    <span className="inline-flex items-center gap-1 mt-3 px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        <Shield size={14} /> Admin Access
                    </span>
                )}
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ x: -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <NavItem
                            icon={item.icon}
                            label={item.label}
                            active={activeSection === item.id}
                            onClick={() => {
                                if (item.href) navigate(item.href);
                                else setActiveSection(item.id);
                            }}
                        />
                    </motion.div>
                ))}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 mt-6 px-5 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </motion.button>
            </nav>
        </motion.aside>
    );

    // Mobile Bottom Navigation
    const MobileTabs = () => (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-orange-200 shadow-2xl z-50">
            <div className="flex justify-around items-center py-3">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => item.href ? navigate(item.href) : setActiveSection(item.id)}
                        className={`flex flex-col items-center p-3 rounded-xl transition-all ${activeSection === item.id
                            ? "text-orange-600 bg-orange-100 scale-110"
                            : "text-orange-500"
                            }`}
                    >
                        {item.icon}
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center p-3 text-red-500"
                >
                    <LogOut size={20} />
                    <span className="text-xs mt-1">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col">
            {/* Header */}
            <motion.header
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="bg-white/90 backdrop-blur-md shadow-md py-5 text-center border-b border-orange-100 sticky top-0 z-40"
            >
                <h1 className="text-3xl font-bold text-orange-800">My Account</h1>
                <p className="text-orange-600">Welcome back, {user?.name?.split(" ")[0]}!</p>
            </motion.header>

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 pb-24 lg:pb-8">
                    <div className="max-w-6xl mx-auto">
                        <AnimatePresence mode="wait">
                            {activeSection === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-white rounded-2xl shadow-xl border border-orange-200 p-8">
                                        <ProfileSettings />
                                    </div>
                                </motion.div>
                            )}

                            {activeSection === "orders" && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-white rounded-2xl shadow-xl border border-orange-200 p-8">
                                        <OrdersSection />
                                    </div>
                                </motion.div>
                            )}

                            {activeSection === "add-product" && isAdmin && (
                                <motion.div
                                    key="add-product"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <AddProduct />
                                </motion.div>
                            )}

                            {activeSection === "admin" && isAdmin && (
                                <motion.div
                                    key="admin"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-white rounded-2xl shadow-xl border border-orange-200 p-8">
                                        <AdminDashboard />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            <MobileTabs />
        </div>
    );
};

// Helper Components
const UserAvatar = ({ user }) => {
    const letter = user?.name?.charAt(0).toUpperCase() || "U";
    return (
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-orange-200">
            {letter}
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <motion.button
        whileHover={{ x: 8 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left font-medium transition-all ${active
            ? "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-2 border-orange-300 shadow-md"
            : "text-orange-700 hover:bg-orange-50"
            }`}
    >
        {icon}
        <span>{label}</span>
    </motion.button>
);

export default Profile;