import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    PlusCircle,
    Users,
    Star,
    LogOut,
    X
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag /> },
        { name: 'All Products', path: '/admin/products', icon: <ShoppingBag /> },
        { name: 'Add Product', path: '/admin/product/new', icon: <PlusCircle /> },
        { name: 'Users', path: '/admin/users', icon: <Users /> },
        // { name: 'Reviews', path: '/admin/reviews', icon: <Star /> },
    ];

    const sidebarVariants = {
        open: { x: 0, opacity: 1 },
        closed: { x: '-100%', opacity: 0 },
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <motion.div
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 lg:translate-x-0 lg:static lg:block ${!isOpen ? 'hidden lg:block' : ''}`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-orange-100 bg-orange-50/50">
                    <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                        Bagify<span className="text-gray-800 text-sm ml-1 font-medium">Admin</span>
                    </Link>
                    <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-orange-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose && onClose()}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200'
                                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                    }`}
                            >
                                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer actions? */}
                <div className="absolute bottom-8 left-0 w-full px-4">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100/50">
                        <p className="text-xs text-orange-800/60 font-medium mb-2">Admin Control</p>
                        <p className="text-sm text-gray-600">Manage your store efficiently.</p>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;
