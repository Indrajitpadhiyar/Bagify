// src/components/Navbar.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
    Search,
    Menu,
    X,
    Home,
    Grid,
    Tag,
    Heart,
    User,
    LogOut,
    Package,
    Settings,
    Shield,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/actions/user.Action";

// Import the new cart component
import CartButton from "./CartButton";

const SearchDropdown = ({
    query,
    results,
    isOpen,
    onSelect,
    onClose,
}) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const hasExact = results.some((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <AnimatePresence>
            <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="search-dropdown absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50"
            >
                {results.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                        No products found for “<strong>{query}</strong>”
                    </div>
                ) : (
                    <ul className="max-h-96 overflow-y-auto">
                        {results.map((product, idx) => (
                            <motion.li
                                key={product._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                            >
                                <Link
                                    to={`/product/${product._id}`}
                                    onClick={() => {
                                        onSelect();
                                        onClose();
                                    }}
                                    className="flex items-center gap-4 px-5 py-3 hover:bg-orange-50 transition-colors"
                                >
                                    <img
                                        src={product.images?.[0]?.url || "/placeholder.jpg"}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            ₹{product.price?.toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            </motion.li>
                        ))}
                        {!hasExact && query && (
                            <li className="px-5 py-2 text-xs text-gray-400 italic">
                                Showing related results
                            </li>
                        )}
                    </ul>
                )}
                {/* Footer – View all */}
                {query && results.length > 0 && (
                    <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                        <Link
                            to={`/search?q=${encodeURIComponent(query)}`}
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 text-orange-600 font-medium hover:underline"
                        >
                            <Search className="w-4 h-4" />
                            View all results for “{query}”
                        </Link>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

const UserAvatar = ({ user, size = "w-8 h-8", textSize = "text-sm" }) => {
    if (user?.avatar?.url) {
        return (
            <img
                src={user.avatar.url}
                alt={user.name}
                className={`${size} rounded-full object-cover border-2 border-white`}
            />
        );
    }

    const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    const getColorClass = (letter) => {
        const colors = {
            A: "bg-red-500",
            B: "bg-blue-500",
            C: "bg-green-500",
            D: "bg-yellow-500",
            E: "bg-purple-500",
            F: "bg-pink-500",
            G: "bg-indigo-500",
            H: "bg-teal-500",
            I: "bg-orange-500",
            J: "bg-red-600",
            K: "bg-blue-600",
            L: "bg-green-600",
            M: "bg-yellow-600",
            N: "bg-purple-600",
            O: "bg-pink-600",
            P: "bg-indigo-600",
            Q: "bg-teal-600",
            R: "bg-orange-600",
            S: "bg-red-400",
            T: "bg-blue-400",
            U: "bg-green-400",
            V: "bg-yellow-400",
            W: "bg-purple-400",
            X: "bg-pink-400",
            Y: "bg-indigo-400",
            Z: "bg-teal-400",
        };
        return colors[letter] || "bg-gray-500";
    };

    const colorClass = getColorClass(firstLetter);

    return (
        <div
            className={`${size} ${colorClass} rounded-full flex items-center justify-center text-white font-bold ${textSize} shadow-md`}
        >
            {firstLetter}
        </div>
    );
};

const UserDropdown = ({ user, onClose, onLogout }) => {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 min-w-48 border border-gray-100"
            >
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100">
                    <div className="flex items-center gap-3">
                        <UserAvatar user={user} size="w-10 h-10" textSize="text-base" />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate text-sm">
                                {user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="p-2">
                    <button
                        onClick={() => handleNavigation("/profile")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-gray-700 w-full text-left"
                    >
                        <User className="w-4 h-4" />
                        <span className="text-sm">My Profile</span>
                    </button>

                    <button
                        onClick={() => handleNavigation("/profile/orders")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-gray-700 w-full text-left"
                    >
                        <Package className="w-4 h-4" />
                        <span className="text-sm">My Orders</span>
                    </button>

                    <button
                        onClick={() => handleNavigation("/profile/settings")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-gray-700 w-full text-left"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                    </button>

                    {user?.role === "admin" && (
                        <button
                            onClick={() => handleNavigation("/admin/dashboard")}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors text-purple-700 w-full text-left border-t border-gray-100 mt-2 pt-2"
                        >
                            <Shield className="w-4 h-4" />
                            <span className="text-sm">Admin Dashboard</span>
                        </button>
                    )}

                    <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                            onClick={() => {
                                onLogout();
                                onClose();
                            }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600 w-full text-left"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const { isAuthenticated, user, loading } = useSelector((state) => state.user);
    const { products = [] } = useSelector((state) => state.products || {});


    const filtered = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();

        const exact = products.filter((p) => p.name.toLowerCase().includes(q));
        if (exact.length > 0) return exact.slice(0, 8);

        return products
            .filter((p) =>
                p.name
                    .toLowerCase()
                    .split(" ")
                    .some((w) => w.startsWith(q))
            )
            .slice(0, 8);
    }, [searchQuery, products]);

    useEffect(() => {
        const unlisten = navigate(() => {
            setShowDropdown(false);
            setSearchQuery("");
        });
        return unlisten;
    }, [navigate]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowDropdown(false);
            setSearchQuery("");
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        setShowUserDropdown(false);
        navigate("/");
    };

    const navItems = [
        { id: "home", label: "Home", icon: Home, path: "/" },
        { id: "products", label: "All Products", icon: Grid, path: "/products" },
        { id: "deals", label: "Hot Deals", icon: Tag, path: "/deals" },
        { id: "wishlist", label: "Wishlist", icon: Heart, path: "/wishlist" },
    ];

    const handleNavClick = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    const currentPath = window.location.pathname;

    if (loading) {
        return (
            <nav className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                            <div className="w-full h-12 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="md:hidden w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* LOGO */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                            <img
                                src="/bagifyLogo.png"
                                alt="Bagify"
                                className="w-full h-full rounded-full"
                            />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                            Bagify
                        </span>
                    </motion.div>

                    {/* DESKTOP SEARCH BAR */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="hidden md:flex flex-1 max-w-2xl mx-8 relative"
                    >
                        <div className="relative w-full group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowDropdown(!!e.target.value);
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => searchQuery && setShowDropdown(true)}
                                placeholder="Search for products..."
                                className="w-full px-6 py-3 pl-12 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        </div>

                        <SearchDropdown
                            query={searchQuery}
                            results={filtered}
                            isOpen={showDropdown}
                            onSelect={() => {
                                setSearchQuery("");
                                setShowDropdown(false);
                            }}
                            onClose={() => setShowDropdown(false)}
                        />
                    </motion.div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center space-x-4">
                        {/* CART – NOW A SEPARATE COMPONENT */}
                        <CartButton />

                        {/* LOGIN / USER PROFILE */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {isAuthenticated ? (
                                    <motion.button
                                        key="profile"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onMouseEnter={() => setShowUserDropdown(true)}
                                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 relative group"
                                    >
                                        <UserAvatar user={user} />
                                        <span className="hidden sm:inline font-medium">
                                            {user?.name?.split(" ")[0] || "User"}
                                        </span>
                                        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        key="login"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate("/login")}
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 font-medium"
                                    >
                                        Login
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {isAuthenticated && showUserDropdown && (
                                <div
                                    onMouseLeave={() => setShowUserDropdown(false)}
                                    className="absolute right-0 top-full mt-2 z-50"
                                >
                                    <UserDropdown
                                        user={user}
                                        onClose={() => setShowUserDropdown(false)}
                                        onLogout={handleLogout}
                                    />
                                </div>
                            )}
                        </div>

                        {/* MOBILE MENU TOGGLE */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </motion.button>
                    </div>
                </div>

                {/* DESKTOP NAV LINKS */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="hidden md:flex items-center justify-center space-x-2 pb-4"
                >
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.path;

                        return (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.4 }}
                                whileHover={{ y: -2 }}
                                onClick={() => handleNavClick(item.path)}
                                className="relative px-6 py-2.5 rounded-full transition-all duration-300 group overflow-hidden"
                            >
                                <div
                                    className={`absolute inset-0 rounded-full transition-all duration-500 ${isActive
                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 scale-100 opacity-100"
                                        : "bg-orange-100 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                                        }`}
                                />
                                <div className="relative flex items-center space-x-2">
                                    <Icon
                                        className={`w-5 h-5 transition-colors duration-300 ${isActive
                                            ? "text-white"
                                            : "text-gray-700 group-hover:text-orange-600"
                                            }`}
                                    />
                                    <span
                                        className={`font-medium transition-colors duration-300 ${isActive
                                            ? "text-white"
                                            : "text-gray-700 group-hover:text-orange-600"
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                                {isActive && (
                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* MOBILE SEARCH */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="md:hidden pb-4 relative"
                >
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowDropdown(!!e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => searchQuery && setShowDropdown(true)}
                            placeholder="Search products..."
                            className="w-full px-4 py-2 pl-10 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-all duration-300"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    <SearchDropdown
                        query={searchQuery}
                        results={filtered}
                        isOpen={showDropdown}
                        onSelect={() => {
                            setSearchQuery("");
                            setShowDropdown(false);
                        }}
                        onClose={() => setShowDropdown(false)}
                    />
                </motion.div>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-2 bg-gradient-to-b from-white to-orange-50">
                            {navItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = currentPath === item.path;

                                return (
                                    <motion.button
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ x: 5 }}
                                        onClick={() => handleNavClick(item.path)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105"
                                            : "bg-white text-gray-700 hover:bg-orange-50 hover:scale-102"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;