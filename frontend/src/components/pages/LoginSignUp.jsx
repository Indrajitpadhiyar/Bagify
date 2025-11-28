import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail, Lock, User, Eye, EyeOff,
    ChevronDown, ChevronUp, Sparkles, Loader2,
    Upload, X
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { clearErrors, login, register } from "../../redux/actions/user.Action"

const LoginSignUp = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false);

    // Login States
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Signup States
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Profile Picture States
    const [avatarFile, setAvatarFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error, isAuthenticated, user } = useSelector((state) => state.user);

    // Redirect if user is already logged in
    useEffect(() => {
        if (isAuthenticated) {
            toast.error("You are already logged in!");
            navigate("/profile");
        }
    }, [isAuthenticated, navigate]);

    // Handle authentication errors
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
            setLoading(false);
        }

        if (isAuthenticated) {
            toast.success(`Welcome back, ${user.name || user.email}!`);
            navigate("/profile");
        }
    }, [dispatch, error, isAuthenticated, user, navigate]);

    // Handle Image Upload
    const handleImageChange = (file) => {
        if (!file) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const maxSize = 2 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            setImageError("Please upload a valid image (JPG, PNG, WebP)");
            return;
        }
        if (file.size > maxSize) {
            setImageError("Image size should be less than 2MB");
            return;
        }

        setImageError("");
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    // Login Handler
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await dispatch(login(loginEmail, loginPassword));
        } catch (err) {
            toast.error("Login failed. Please try again.");
            setLoading(false);
        }
    };

    // Signup Handler
    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("name", signupName);
        formData.append("email", signupEmail);
        formData.append("password", signupPassword);
        if (avatarFile) formData.append("avatar", avatarFile); // Must be "avatar"

        try {
            await dispatch(register(formData));
            toast.success("Account created! Please login.");
            setIsExpanded(false);
            // Clear form
            setSignupName(""); setSignupEmail(""); setSignupPassword(""); setConfirmPassword("");
            setAvatarFile(null); setImagePreview(null);
        } catch (err) {
            toast.error("Registration failed");
        } finally {
            setLoading(false);
        }
    };
    // Reset form when switching between login/signup
    const handleToggleForm = (isSignup) => {
        setIsExpanded(isSignup);
        setPasswordError("");
        setImageError("");
        dispatch(clearErrors());
    };

    // If user is already authenticated, show loading or redirect message
    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-4">
                    <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                    <p className="text-lg font-semibold text-gray-800">Redirecting to profile...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Loading Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-4"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ type: "spring" }}
                        >
                            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
                            <p className="text-lg font-semibold text-gray-800">
                                {isExpanded ? "Creating Account..." : "Logging You In..."}
                            </p>
                            <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4 overflow-hidden">
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl shadow-2xl overflow-hidden bg-white h-[90vh] md:h-full">

                    {/* LEFT: Brand - Hidden on mobile when in signup form */}
                    <motion.div
                        className={`relative bg-gradient-to-br from-orange-500 to-orange-600 p-6 md:p-10 flex flex-col justify-center items-center text-white ${isExpanded ? 'hidden md:flex' : 'flex'}`}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Background Animation */}
                        <motion.div
                            className="absolute inset-0 opacity-20"
                            animate={{
                                background: isHovered
                                    ? [
                                        "radial-gradient(circle at 20% 80%, #fbbf24, transparent 50%)",
                                        "radial-gradient(circle at 80% 20%, #f97316, transparent 50%)",
                                        "radial-gradient(circle at 50% 50%, #ea580c, transparent 50%)",
                                    ]
                                    : ["radial-gradient(circle at 50% 50%, #ea580c, transparent 50%)"],
                            }}
                            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        />

                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute"
                                animate={{
                                    opacity: isHovered ? [0, 1, 0] : 0,
                                    scale: isHovered ? [0, 1.3, 0] : 0,
                                    x: [0, i % 2 === 0 ? 25 : -25, 0],
                                    y: [0, -30, 0],
                                }}
                                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                                style={{ top: `${25 + i * 12}%`, left: i % 2 === 0 ? "20%" : "60%" }}
                            >
                                <Sparkles className="w-5 h-5 text-yellow-300" />
                            </motion.div>
                        ))}

                        <motion.div className="relative z-10 text-center">
                            <motion.div
                                className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-xl"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.8 }}
                            >
                                <img src="/bagifyLogo.png" alt="Bagify" className="w-14 h-14 object-contain" />
                            </motion.div>

                            <motion.h1 className="text-3xl md:text-4xl font-bold mb-2">
                                Bagify
                            </motion.h1>
                            <p className="text-orange-100 text-sm md:text-base max-w-xs mx-auto">
                                Premium bags for every journey. Style meets comfort.
                            </p>

                            <motion.div className="mt-6 flex gap-2 justify-center flex-wrap">
                                {["Quality", "Style", "Comfort"].map((word, i) => (
                                    <motion.span
                                        key={word}
                                        className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs backdrop-blur-sm"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 + i * 0.1 }}
                                        whileHover={{ scale: 1.1, y: -3 }}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT: Forms */}
                    <div className="p-5 md:p-8 flex flex-col bg-white h-full overflow-y-auto">
                        <motion.div className="max-w-md mx-auto w-full flex flex-col">
                            {/* Back button for mobile when in signup form */}
                            {isExpanded && (
                                <button
                                    onClick={() => handleToggleForm(false)}
                                    className="md:hidden flex items-center gap-2 text-orange-600 mb-4 self-start"
                                >
                                    <ChevronUp className="w-4 h-4" />
                                    Back to Login
                                </button>
                            )}

                            <div className="text-center mb-6">
                                <motion.h2
                                    key={isExpanded ? "signup" : "login"}
                                    initial={{ opacity: 0, y: -15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-2xl md:text-3xl font-bold text-gray-800"
                                >
                                    {isExpanded ? "Create Account" : "Welcome Back"}
                                </motion.h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    {isExpanded ? "Join the Bagify family" : "Login to continue shopping"}
                                </p>
                            </div>

                            <AnimatePresence mode="wait">
                                {/* LOGIN FORM */}
                                {!isExpanded ? (
                                    <motion.form
                                        key="login"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        onSubmit={handleLogin}
                                        className="space-y-4 flex-1"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={loginEmail}
                                                    onChange={(e) => setLoginEmail(e.target.value)}
                                                    required
                                                    disabled={loading}
                                                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={loginPassword}
                                                    onChange={(e) => setLoginPassword(e.target.value)}
                                                    required
                                                    disabled={loading}
                                                    className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    disabled={loading}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs">
                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                                <input type="checkbox" className="rounded text-orange-600" disabled={loading} />
                                                <span className="text-gray-600">Remember me</span>
                                            </label>
                                            <a href="#" className="text-orange-600 hover:underline">Forgot?</a>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: loading ? 1 : 1.02 }}
                                            whileTap={{ scale: loading ? 1 : 0.98 }}
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Logging in…
                                                </>
                                            ) : (
                                                "Login Now"
                                            )}
                                        </motion.button>

                                        <div className="text-center text-xs text-gray-600">
                                            Don't have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleForm(true)}
                                                disabled={loading}
                                                className="text-orange-600 font-medium hover:underline inline-flex items-center gap-1"
                                            >
                                                Register here
                                                <ChevronDown className="w-3 h-3 animate-bounce" />
                                            </button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    /* SIGNUP FORM */
                                    <motion.form
                                        key="signup"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        onSubmit={handleSignup}
                                        className="space-y-4 flex-1 flex flex-col"
                                    >
                                        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
                                            {/* Profile Picture */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Profile Picture <span className="text-gray-400 text-xs">(Optional)</span>
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-16 h-16 bg-gray-100 border-2 border-dashed rounded-full flex items-center justify-center overflow-hidden">
                                                            {imagePreview ? (
                                                                <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <User className="w-7 h-7 text-gray-400" />
                                                            )}
                                                        </div>
                                                        {imagePreview && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setImagePreview(null);
                                                                    setAvatarFile(null);
                                                                }}
                                                                className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageChange(e.target.files[0])}
                                                            className="hidden"
                                                            id="avatar-upload"
                                                            disabled={loading}
                                                        />
                                                        <label
                                                            htmlFor="avatar-upload"
                                                            className={`block text-sm font-medium text-orange-600 cursor-pointer hover:text-orange-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                                                                }`}
                                                        >
                                                            {imagePreview ? "Change Photo" : "Upload Photo"}
                                                        </label>
                                                        <p className="text-xs text-gray-500">JPG, PNG, WebP &lt; 2MB</p>
                                                    </div>
                                                </div>
                                                {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
                                            </div>

                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={signupName}
                                                        onChange={(e) => setSignupName(e.target.value)}
                                                        required
                                                        disabled={loading}
                                                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        value={signupEmail}
                                                        onChange={(e) => setSignupEmail(e.target.value)}
                                                        required
                                                        disabled={loading}
                                                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                                                        placeholder="you@example.com"
                                                    />
                                                </div>
                                            </div>

                                            {/* Password */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={signupPassword}
                                                        onChange={(e) => setSignupPassword(e.target.value)}
                                                        required
                                                        disabled={loading}
                                                        className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        disabled={loading}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Confirm Password */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                        disabled={loading}
                                                        className={`w-full pl-9 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm ${passwordError ? "border-red-500" : "border-gray-300"
                                                            }`}
                                                        placeholder="••••••••"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        disabled={loading}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                                            </div>
                                        </div>

                                        {/* Submit Button - Always visible at bottom */}
                                        <div className="pt-4 border-t border-gray-200">
                                            <motion.button
                                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Creating…
                                                    </>
                                                ) : (
                                                    "Create Account"
                                                )}
                                            </motion.button>

                                            {/* Back to Login */}
                                            <div className="text-center text-xs text-gray-600 mt-3">
                                                Already have an account?{" "}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleForm(false)}
                                                    disabled={loading}
                                                    className="text-orange-600 font-medium hover:underline inline-flex items-center gap-1"
                                                >
                                                    Login
                                                    <ChevronUp className="w-3 h-3 animate-bounce" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            <p className="text-center text-xs text-gray-500 mt-6">
                                By continuing, you agree to our{" "}
                                <a href="#" className="text-orange-600 hover:underline">Terms</a> and{" "}
                                <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginSignUp;