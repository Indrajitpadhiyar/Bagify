import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Truck, MapPin, Edit2, CheckCircle, X, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../redux/actions/order.Action";
import { clearCart } from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";

// Address Modal
const AddressModal = ({ isOpen, onClose, onSave, currentAddress }) => {
    const [address, setAddress] = useState(currentAddress);

    useEffect(() => {
        setAddress(currentAddress);
    }, [currentAddress, isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 relative">
                        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <MapPin className="w-5 h-5" /> Edit Delivery Address
                        </h2>
                    </div>

                    <div className="p-5 space-y-3">
                        <input
                            type="text"
                            placeholder="Full Name *"
                            value={address.name}
                            onChange={(e) => setAddress({ ...address, name: e.target.value })}
                            className="w-full p-3 border rounded-xl text-sm focus:border-orange-500 outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Phone Number *"
                            value={address.phone}
                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                            className="w-full p-3 border rounded-xl text-sm focus:border-orange-500 outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Flat, House no., Building *"
                            value={address.flat}
                            onChange={(e) => setAddress({ ...address, flat: e.target.value })}
                            className="w-full p-3 border rounded-xl text-sm focus:border-orange-500 outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Area, Street, Sector *"
                            value={address.area}
                            onChange={(e) => setAddress({ ...address, area: e.target.value })}
                            className="w-full p-3 border rounded-xl text-sm focus:border-orange-500 outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Landmark (Optional)"
                            value={address.landmark}
                            onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                            className="w-full p-3 border rounded-xl text-sm focus:border-orange-500 outline-none"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="City *"
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                className="p-3 border rounded-xl text-sm focus:border-orange-500 outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Pincode *"
                                value={address.pincode}
                                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                className="p-3 border rounded-xl text-sm focus:border-orange-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 p-4 bg-gray-50">
                        <button onClick={onClose} className="flex-1 py-2.5 rounded-full border border-gray-300 font-medium text-sm hover:bg-gray-100">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onSave(address);
                                onClose();
                            }}
                            className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
                        >
                            <CheckCircle className="w-4 h-4" /> Save Address
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Checkout Modal
export const CheckoutModal = ({ isOpen, onClose, onSuccess, overrideCartItems }) => {
    const { cartItems: reduxCartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = overrideCartItems || reduxCartItems;
    const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

    // Default Address from your data
    const defaultAddress = {
        name: "User", // You can set from user.name if available
        phone: user?.shippingInfo?.phoneNo || "12345671234",
        flat: user?.shippingInfo?.address || "Tavra",
        area: "",
        landmark: "",
        city: user?.shippingInfo?.city || "Bharuch",
        pincode: user?.shippingInfo?.pinCode || "392011",
        state: user?.shippingInfo?.state || "Gujarat",
    };

    const [address, setAddress] = useState(defaultAddress);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const handleEditAddress = () => {
        setShowAddressModal(true);
    };

    const handleSaveAddress = (updatedAddress) => {
        setAddress(updatedAddress);
    };

    const handlePlaceOrder = () => {
        if (cartItems.length === 0) return toast.error("No items to checkout");

        const required = ['name', 'phone', 'flat', 'area', 'city', 'pincode'];
        const missing = required.filter(field => !address[field]);

        if (missing.length > 0) {
            toast.error("Please fill all required address fields");
            return;
        }

        const orderData = {
            shippingInfo: {
                address: `${address.flat}, ${address.area}${address.landmark ? ", " + address.landmark : ""}`,
                city: address.city,
                state: address.state,
                pinCode: address.pincode,
                phoneNo: address.phone,
                name: address.name,
                country: "India",
            },
            orderItems: cartItems.map((item) => ({
                name: item.name,
                price: item.price,
                quantity: item.qty,
                image: item.image,
                product: item._id,
            })),
            paymentInfo: { id: "cod_" + Date.now(), status: "pending" },
            itemsPrice: total,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: total,
        };

        dispatch(createOrder(orderData));

        if (!overrideCartItems) {
            dispatch(clearCart());
        }

        toast.success("Order placed successfully!");
        onClose();
        if (onSuccess) onSuccess();
        navigate("/profile/orders");
    };

    if (!isOpen) return null;

    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 relative">
                            <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30">
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Truck className="w-6 h-6" /> Checkout
                            </h2>
                        </div>

                        <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
                            {/* Address Summary */}
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-semibold text-sm text-orange-800 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Delivery Address
                                    </p>
                                    <button
                                        onClick={handleEditAddress}
                                        className="text-xs text-orange-600 underline flex items-center gap-1 hover:text-orange-700"
                                    >
                                        <Edit2 className="w-3 h-3" /> Edit
                                    </button>
                                </div>
                                <p className="text-sm font-medium">{address.name}, {address.phone}</p>
                                <p className="text-xs text-gray-600">
                                    {address.flat}, {address.area}{address.landmark ? ", " + address.landmark : ""}, {address.city}, {address.state} - {address.pincode}
                                </p>
                            </div>

                            {/* Cart Items */}
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p>
                                    </div>
                                    <p className="font-bold text-orange-600">₹{(item.price * item.qty).toLocaleString()}</p>
                                </div>
                            ))}

                            <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-orange-600">₹{total.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center gap-2 p-3 border-2 border-green-500 rounded-xl bg-green-50">
                                <Lock className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-700">Cash on Delivery (COD)</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 flex gap-2">
                            <button onClick={onClose} className="flex-1 py-2.5 rounded-full border border-gray-300 font-medium text-sm hover:bg-gray-100">
                                Cancel
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
                            >
                                <CheckCircle className="w-4 h-4" /> Place Order
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Edit Address Modal */}
            <AddressModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSave={handleSaveAddress}
                currentAddress={address}
            />
        </>
    );
};

// Checkout Button (for Cart page)
const CheckoutButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
                <Truck className="w-5 h-5" /> Proceed to Checkout
            </motion.button>

            <CheckoutModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default CheckoutButton;