import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { resetPassword, clearErrors } from "../../redux/actions/password.Action";
import toast from "react-hot-toast";
import MetaData from "../ui/MetaData";

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { error, success, loading } = useSelector(
        (state) => state.resetPassword
    );

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            toast.success("Password reset successfully! Please login.");
            navigate("/login");
        }
    }, [dispatch, error, success, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        dispatch(resetPassword(token, { password, confirmPassword }));
    };

    const passwordStrength = (pass) => {
        if (pass.length < 6) return { label: "Weak", color: "red" };
        if (pass.length < 10) return { label: "Medium", color: "yellow" };
        return { label: "Strong", color: "green" };
    };

    const strength = passwordStrength(password);

    return (
        <>
            <MetaData title="Reset Password - Bagify" />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 text-white">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2 text-center">
                                Reset Password
                            </h1>
                            <p className="text-orange-100 text-center">
                                Choose a new strong password
                            </p>
                        </div>

                        {/* Form */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {/* Password Strength Indicator */}
                                    {password && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width:
                                                            strength.label === "Weak"
                                                                ? "33%"
                                                                : strength.label === "Medium"
                                                                    ? "66%"
                                                                    : "100%",
                                                    }}
                                                    className={`h-full ${strength.color === "red"
                                                            ? "bg-red-500"
                                                            : strength.color === "yellow"
                                                                ? "bg-yellow-500"
                                                                : "bg-green-500"
                                                        }`}
                                                />
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${strength.color === "red"
                                                        ? "text-red-600"
                                                        : strength.color === "yellow"
                                                            ? "text-yellow-600"
                                                            : "text-green-600"
                                                    }`}
                                            >
                                                {strength.label}
                                            </span>
                                        </div>
                                    )}
                                    <p className="mt-2 text-sm text-gray-500">
                                        Must be at least 6 characters
                                    </p>
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter new password"
                                            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {/* Match Indicator */}
                                    {confirmPassword && (
                                        <div className="mt-2 flex items-center gap-2">
                                            {password === confirmPassword ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm text-green-600 font-medium">
                                                        Passwords match
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-red-600 font-medium">
                                                    Passwords don't match
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default ResetPassword;
