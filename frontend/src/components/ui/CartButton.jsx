// src/components/CartButton.jsx
import React from 'react';
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CartButton = () => {
    const navigate = useNavigate();
    const { cartItems = [] } = useSelector((state) => state.cart || {});

    // Calculate total items in cart
    const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/cart')}
            className="relative p-2 hover:bg-orange-50 rounded-full transition-all duration-300"
        >
            <ShoppingCart className="w-6 h-6 text-gray-700" />

            {/* Cart Badge - Only show if count > 0 */}
            {cartCount > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md"
                >
                    {cartCount}
                </motion.span>
            )}
        </motion.button>
    );
};

export default CartButton;