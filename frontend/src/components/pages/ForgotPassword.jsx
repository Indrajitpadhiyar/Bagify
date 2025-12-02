import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { forgotPassword, clearErrors } from "../../redux/actions/password.Action";
import toast from "react-hot-toast";
import MetaData from "../ui/MetaData";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    const { error, message, loading } = useSelector(
        (state) => state.forgotPassword
    );

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (message) {
            toast.success(message);
        }
    }, [dispatch, error, message]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email");
            return;
        }

        dispatch(forgotPassword(email));
    };

    return (
        <>
            <MetaData title="Forgot Password - Bagify" />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Back Button */}
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Login</span>
                    </Link>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 text-white">
                            <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
                            <p className="text-orange-100">
                                Don't worry, we'll send you reset instructions
                            </p>
                        </div>

                        {/* Form */}
                        <div className="p-8">
                            {message ? (
                                // Success State
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        Check Your Email!
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        We've sent password reset instructions to:
                                    </p>
                                    <p className="font-semibold text-orange-600 mb-6">{email}</p>
                                    <p className="text-sm text-gray-500 mb-8">
                                        Didn't receive the email? Check your spam folder or try again.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setEmail("");
                                            window.location.reload();
                                        }}
                                        className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                                    >
                                        Send Again
                                    </button>
                                </motion.div>
                            ) : (
                                // Form State
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                                                disabled={loading}
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Enter the email associated with your account
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default ForgotPassword;
