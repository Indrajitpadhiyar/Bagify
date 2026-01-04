import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Edit2, User, Mail, MapPin, Shield, Calendar, Phone, Check, X } from "lucide-react";
import { updateUser, clearErrors, loadUser } from "../../redux/actions/user.Action";
import toast from "react-hot-toast";

const ProfileSettings = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.user);

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [landmark, setLandmark] = useState("");
    const [area, setArea] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setAddress(user.shippingInfo?.address || "");
            setCity(user.shippingInfo?.city || "");
            setState(user.shippingInfo?.state || "");
            setPinCode(user.shippingInfo?.pinCode || "");
            setPhoneNo(user.shippingInfo?.phoneNo || "");
            setLandmark(user.shippingInfo?.landmark || "");
            setArea(user.shippingInfo?.area || "");
            setAvatarPreview(user.avatar?.url || "");
        }
    }, [user]);

    // Show toast for errors
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [error, dispatch]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, WebP allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
        setAvatarFile(file);
    };

    const handleSave = async () => {
        if (!name || !email) return toast.error("Name & Email required");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        if (address) formData.append("address", address);
        if (city) formData.append("city", city);
        if (state) formData.append("state", state);
        if (pinCode) formData.append("pinCode", pinCode);
        if (phoneNo) formData.append("phoneNo", phoneNo);
        if (landmark) formData.append("landmark", landmark);
        if (area) formData.append("area", area);
        formData.append("country", "India");
        if (avatarFile) formData.append("avatar", avatarFile);

        try {
            await dispatch(updateUser(formData));

            toast.success("Profile updated successfully!");

            // Force refresh user data + bust avatar cache
            dispatch(loadUser());
            setAvatarPreview(prev => prev + "?t=" + Date.now());

            setIsEditing(false);
            setAvatarFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            toast.error("Failed to update profile");
        }
    };

    const handleCancel = () => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setAddress(user.shippingInfo?.address || "");
            setCity(user.shippingInfo?.city || "");
            setState(user.shippingInfo?.state || "");
            setPinCode(user.shippingInfo?.pinCode || "");
            setPhoneNo(user.shippingInfo?.phoneNo || "");
            setLandmark(user.shippingInfo?.landmark || "");
            setArea(user.shippingInfo?.area || "");
            setAvatarPreview(user.avatar?.url || "");
        }
        setAvatarFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsEditing(false);
    };

    const avatarHover = {
        scale: 1.12,
        rotate: 6,
        transition: {
            type: "spring",
            stiffness: 400
        }
    };

    const btnHover = {
        scale: 1.05,
        boxShadow: "0 8px 20px rgba(249,115,22,.3)"
    };

    const btnTap = {
        scale: 0.95
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 p-4 md:p-6"
        >
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Profile Settings</h2>
                <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
            </div>

            {/* Avatar Section */}
            <div className="flex justify-center">
                <div className="relative inline-block">
                    <motion.div
                        variants={avatarHover}
                        whileHover={isEditing ? "hover" : ""}
                        className="relative"
                    >
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="avatar"
                                className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover shadow-xl ring-4 ring-orange-100 border-4 border-white"
                            />
                        ) : (
                            <UserAvatar
                                user={user}
                                size="h-32 w-32 md:h-40 md:w-40"
                                textSize="text-4xl md:text-5xl"
                            />
                        )}

                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center"
                            >
                                <span className="text-white text-sm font-medium">Change Photo</span>
                            </motion.div>
                        )}
                    </motion.div>

                    <AnimatePresence>
                        {isEditing && (
                            <motion.label
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                            >
                                <Camera size={20} />
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                />
                            </motion.label>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                    {
                        label: "Full Name",
                        value: name,
                        set: setName,
                        type: "text",
                        icon: <User size={18} />,
                        required: true
                    },
                    {
                        label: "Email Address",
                        value: email,
                        set: setEmail,
                        type: "email",
                        icon: <Mail size={18} />,
                        required: true
                    },
                    {
                        label: "Phone Number",
                        value: phoneNo,
                        set: setPhoneNo,
                        type: "tel",
                        icon: <Phone size={18} />,
                        pattern: "[0-9]{10}"
                    },
                    {
                        label: "Address",
                        value: address,
                        set: setAddress,
                        type: "text",
                        icon: <MapPin size={18} />,
                        fullWidth: true
                    },
                    {
                        label: "Area / Street / Sector",
                        value: area,
                        set: setArea,
                        type: "text",
                        icon: <MapPin size={18} />,
                        fullWidth: true
                    },
                    {
                        label: "Landmark",
                        value: landmark,
                        set: setLandmark,
                        type: "text",
                        icon: <MapPin size={18} />,
                        fullWidth: true
                    },
                    {
                        label: "City",
                        value: city,
                        set: setCity,
                        type: "text",
                        icon: <MapPin size={18} />
                    },
                    {
                        label: "State",
                        value: state,
                        set: setState,
                        type: "text",
                        icon: <MapPin size={18} />
                    },
                    {
                        label: "PIN Code",
                        value: pinCode,
                        set: setPinCode,
                        type: "text",
                        icon: <MapPin size={18} />,
                        pattern: "[0-9]{6}"
                    },
                    {
                        label: "Role",
                        value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User",
                        disabled: true,
                        icon: <Shield size={18} />
                    },
                    {
                        label: "Member Since",
                        value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }) : "-",
                        disabled: true,
                        icon: <Calendar size={18} />
                    },
                ].map((field, index) => (
                    <motion.div
                        key={field.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={field.fullWidth ? "md:col-span-2 lg:col-span-3" : ""}
                    >
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            {field.icon}
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type={field.type}
                            value={field.value}
                            onChange={(e) => field.set(e.target.value)}
                            disabled={field.disabled || !isEditing}
                            pattern={field.pattern}
                            placeholder={field.fullWidth && isEditing ? "House no., Street, Area, Landmark..." : ""}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isEditing && !field.disabled
                                ? "border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                                : "border-gray-200 bg-gray-50 text-gray-700"
                                } ${field.disabled ? 'cursor-not-allowed' : ''}`}
                        />
                        {field.pattern && isEditing && (
                            <p className="text-xs text-gray-500 mt-1 ml-1">
                                Format: {field.pattern === "[0-9]{10}" ? "10 digits" : "6 digits"}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6">
                <AnimatePresence mode="wait">
                    {!isEditing ? (
                        <motion.button
                            key="edit"
                            variants={{ hover: btnHover, tap: btnTap }}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <Edit2 size={18} />
                            Edit Profile
                        </motion.button>
                    ) : (
                        <>
                            <motion.button
                                variants={{ hover: btnHover, tap: btnTap }}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={handleSave}
                                disabled={loading}
                                className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-white shadow-md transition-all duration-200 ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        Save Changes
                                    </>
                                )}
                            </motion.button>
                            <motion.button
                                variants={{ hover: btnHover, tap: btnTap }}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={handleCancel}
                                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                            >
                                <X size={18} />
                                Cancel
                            </motion.button>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Update Instructions */}
            {isEditing && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4"
                >
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> After updating your profile, you'll remain logged in.
                        Your profile picture will be updated immediately. Make sure to upload images
                        under 5MB in JPG, PNG, or WebP format.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

/* Avatar Fallback Component */
const UserAvatar = ({ user, size = "h-24 w-24", textSize = "text-3xl" }) => {
    if (user?.avatar?.url) {
        return (
            <img
                src={user.avatar.url}
                alt={user.name}
                className={`${size} rounded-full object-cover shadow-lg ring-4 ring-orange-100 border-4 border-white`}
            />
        );
    }

    const letter = user?.name?.charAt(0).toUpperCase() || "U";
    const colors = {
        A: "bg-orange-500", B: "bg-amber-500", C: "bg-yellow-500", D: "bg-orange-600",
        E: "bg-red-500", F: "bg-pink-500", G: "bg-rose-500", H: "bg-orange-400",
        I: "bg-amber-600", J: "bg-yellow-600", K: "bg-orange-700", L: "bg-amber-700",
        M: "bg-yellow-700", N: "bg-orange-300", O: "bg-amber-300", P: "bg-yellow-300",
        Q: "bg-red-400", R: "bg-pink-400", S: "bg-rose-400", T: "bg-orange-200",
        U: "bg-amber-200", V: "bg-yellow-200", W: "bg-orange-100", X: "bg-amber-100",
        Y: "bg-yellow-100", Z: "bg-gray-400"
    };

    const bg = colors[letter] || "bg-orange-500";

    return (
        <div className={`${size} ${bg} rounded-full flex items-center justify-center text-white font-bold ${textSize} shadow-lg ring-4 ring-orange-50 border-4 border-white`}>
            {letter}
        </div>
    );
};

export default ProfileSettings;