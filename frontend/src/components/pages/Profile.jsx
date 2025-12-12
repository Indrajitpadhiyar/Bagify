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
import AddProduct from "../../components/admin/AddProduct";
import toast from "react-hot-toast";
import AdminOverview from "../admin/AdminOverview";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated, error } = useSelector((state) => state.user);

    const [activeSection, setActiveSection] = useState("profile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const navItems = [
        { id: "home", label: "Home", icon: <Home size={20} />, href: "/" },
        { id: "profile", label: "Profile", icon: <User size={20} /> },
        {
            id: "orders",
            label: isAdmin ? "All Orders" : "My Orders",
            icon: <ShoppingBag size={20} />,
        },
        // ...(isAdmin
        //     ? [{
        //         id: "add-product",
        //         // label: "Add Product",
        //         icon: <PackagePlus size={20} />,
        //     }]
        //     : []),
        ...(isAdmin
            ? [{ id: "admin", label: "Admin Panel", icon: <Shield size={20} /> }]
            : []),
    ];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
        },
    };

    const childVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 120 }
        },
    };

    const sidebarVariants = {
        hidden: { x: -300, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", damping: 25, stiffness: 200 }
        },
        exit: {
            x: -300,
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    const mobileMenuVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", damping: 25 }
        },
        exit: {
            y: 100,
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    const OrdersSection = () => (
        <motion.div
            variants={childVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <h3 className="text-2xl font-bold text-gray-900">
                {isAdmin ? "All Orders" : "My Orders"}
            </h3>
            {[
                { id: "ORD123", date: "Oct 28, 2025", total: "₹2,499", status: "Delivered" },
                { id: "ORD124", date: "Oct 15, 2025", total: "₹1,299", status: "Shipped" },
                { id: "ORD125", date: "Oct 10, 2025", total: "₹799", status: "Processing" },
            ].map((order, i) => (
                <motion.div
                    key={order.id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-center shadow-sm hover:shadow-lg transition-all duration-300"
                >
                    <div>
                        <p className="font-bold text-gray-900">#{order.id}</p>
                        <p className="text-sm text-gray-600 mt-1">{order.date}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">{order.total}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Shipped"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {order.status}
                        </span>
                    </div>
                </motion.div>
            ))}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/orders")}
                className="w-full bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 font-medium py-3 rounded-lg border border-orange-300 transition-all duration-300 shadow-sm hover:shadow"
            >
                View All Orders →
            </motion.button>
        </motion.div>
    );

    // Desktop Sidebar
    const Sidebar = () => (
        <motion.aside
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
            className="hidden lg:flex flex-col w-80 bg-white shadow-2xl border-r border-gray-100"
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 text-center border-b border-gray-100"
            >
                {user?.avatar?.url ? (
                    <motion.img
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        src={user.avatar.url}
                        alt={user.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-orange-200 shadow-lg"
                    />
                ) : (
                    <UserAvatar user={user} />
                )}
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-xl font-bold text-gray-900"
                >
                    {user?.name || "User"}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 text-sm mt-1"
                >
                    {user?.email}
                </motion.p>
                {isAdmin && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="inline-flex items-center gap-1 mt-3 px-4 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-full text-sm font-medium"
                    >
                        <Shield size={14} /> Admin Access
                    </motion.span>
                )}
            </motion.div>

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

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-xl font-medium hover:from-red-100 hover:to-red-200 transition-all duration-300 shadow-sm"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </motion.button>
                </motion.div>
            </nav>
        </motion.aside>
    );

    // Mobile Sidebar Overlay
    const MobileSidebar = () => (
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
                    />
                    <motion.aside
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
                    >
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">My Account</h2>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                {user?.avatar?.url ? (
                                    <img
                                        src={user.avatar.url}
                                        alt={user.name}
                                        className="w-14 h-14 rounded-full object-cover ring-2 ring-orange-300"
                                    />
                                ) : (
                                    <UserAvatar user={user} small />
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-900">{user?.name}</h3>
                                    <p className="text-sm text-gray-600">{user?.email}</p>
                                    {isAdmin && (
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                                            Admin
                                        </span>
                                    )}
                                </div>
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left ${activeSection === item.id
                                        ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );

    // Mobile Bottom Navigation
    const MobileTabs = () => (
        <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40"
        >
            <div className="flex justify-around items-center py-2 px-1">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex flex-col items-center p-2"
                >
                    <User size={20} />
                    <span className="text-xs mt-1">Menu</span>
                </button>
                {navItems.slice(0, 3).map((item) => (
                    <button
                        key={item.id}
                        onClick={() => item.href ? navigate(item.href) : setActiveSection(item.id)}
                        className={`flex flex-col items-center p-2 rounded-lg transition-all ${activeSection === item.id
                            ? "text-orange-600 bg-orange-50"
                            : "text-gray-600"
                            }`}
                    >
                        {item.icon}
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center p-2 text-red-600"
                >
                    <LogOut size={20} />
                    <span className="text-xs mt-1">Logout</span>
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            {/* Header */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/90 backdrop-blur-md shadow-sm py-4 px-6 border-b border-gray-100 sticky top-0 z-30"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className=" w-full flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
                        <p className="text-gray-600 text-sm">Welcome back, {user?.name?.split(" ")[0]}!</p>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <User size={24} />
                    </button>
                </div>
            </motion.header>

            <div className="flex">
                <Sidebar />
                <MobileSidebar />

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8 mb-20 lg:mb-0"
                        >
                            {activeSection === "profile" && <ProfileSettings />}
                            {activeSection === "orders" && <OrdersSection />}
                            {activeSection === "add-product" && isAdmin && <AddProduct />}
                            {activeSection === "admin" && isAdmin && <AdminOverview />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <MobileTabs />
        </div>
    );
};

// Helper Components
const UserAvatar = ({ user, small = false }) => {
    const letter = user?.name?.charAt(0).toUpperCase() || "U";
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            className={`${small ? 'w-14 h-14 text-2xl' : 'w-24 h-24 text-4xl'} rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-orange-300`}
        >
            {letter}
        </motion.div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <motion.button
        whileHover={{ x: 5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left font-medium transition-all ${active
            ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-300 shadow-sm"
            : "text-gray-700 hover:bg-gray-50"
            }`}
    >
        {icon}
        <span>{label}</span>
    </motion.button>
);

export default Profile;