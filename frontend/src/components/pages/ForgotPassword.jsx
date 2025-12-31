import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { forgotPassword, clearErrors } from "../../redux/actions/password.Action";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isHovered, setIsHovered] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, message, error } = useSelector((state) => state.forgotPassword);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (message) {
            toast.success(message);
        }
    }, [dispatch, error, message]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            dispatch(clearErrors());
        };
    }, [dispatch]);

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return "Email is required";
        }
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address";
        }
        return "";
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateEmail(email);
        if (validationError) {
            setEmailError(validationError);
            return;
        }

        setEmailError("");
        dispatch(forgotPassword(email));
    };

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
                                Sending Reset Link...
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
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl shadow-2xl overflow-hidden bg-white">

                    {/* LEFT: Brand Section */}
                    <motion.div
                        className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-10 flex flex-col justify-center items-center text-white"
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

                        {/* Sparkles Animation */}
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

                            <motion.h1 className="text-4xl font-bold mb-2">
                                Bagify
                            </motion.h1>
                            <p className="text-orange-100 text-base max-w-xs mx-auto mb-6">
                                Don't worry! We'll help you reset your password.
                            </p>

                            <motion.div className="mt-6 flex gap-2 justify-center flex-wrap">
                                {["Secure", "Fast", "Simple"].map((word, i) => (
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

                    {/* RIGHT: Form Section */}
                    <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
                        <motion.div
                            className="max-w-md mx-auto w-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Back to Login Link */}
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm font-medium">Back to Login</span>
                            </Link>

                            {/* Header */}
                            <div className="mb-8">
                                <motion.h2
                                    className="text-3xl font-bold text-gray-800 mb-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Forgot Password?
                                </motion.h2>
                                <p className="text-gray-600 text-sm">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            {/* Success Message */}
                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-green-800">
                                                Email Sent Successfully!
                                            </p>
                                            <p className="text-xs text-green-700 mt-1">
                                                {message}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-red-800">
                                                Error
                                            </p>
                                            <p className="text-xs text-red-700 mt-1">
                                                {error}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setEmailError("");
                                            }}
                                            disabled={loading}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all ${emailError
                                                    ? "border-red-500 bg-red-50"
                                                    : "border-gray-300 bg-white"
                                                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {emailError && (
                                        <motion.p
                                            className="text-red-500 text-xs mt-1 flex items-center gap-1"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <AlertCircle className="w-3 h-3" />
                                            {emailError}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-5 h-5" />
                                            Send Reset Link
                                        </>
                                    )}
                                </motion.button>

                                {/* Additional Info */}
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">
                                        Remember your password?{" "}
                                        <Link
                                            to="/login"
                                            className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
                                        >
                                            Login here
                                        </Link>
                                    </p>
                                </div>
                            </form>

                            {/* Security Note */}
                            <motion.div
                                className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <p className="text-xs text-gray-600 text-center">
                                    🔒 For your security, the reset link will expire in 10 minutes.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
