// src/components/ProductCard.jsx
import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';

const ProductCard = ({
    _id,
    name,
    price,
    images = [],
    stock = 0,
    ratings = 0,
    numOfReviews = 0,
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.user);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const isWishlisted = wishlistItems.some(item => item._id === _id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login to add to cart");
            navigate('/login');
            return;
        }
        if (stock <= 0) return toast.error("Out of stock!");

        setIsAdding(true);
        dispatch(addToCart({
            _id, name, price, image: images[0]?.url, stock, qty: 1
        }));
        setTimeout(() => setIsAdding(false), 1000);
    };


    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login to add to wishlist");
            navigate('/login');
            return;
        }

        if (isWishlisted) {
            dispatch(removeFromWishlist(_id));
        } else {
            dispatch(addToWishlist({
                _id, name, price, image: images[0]?.url
            }));
        }
    };

    const imageUrl = images[0]?.url || 'https://via.placeholder.com/300x300/eee/aaa?text=No+Image';

    return (
        <Link to={`/product/${_id}`} className="block h-full">
            <motion.div
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
                style={{ minHeight: '460px' }}
            >
                {/* Wishlist Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleWishlist}
                    className="absolute top-3 right-3 z-20 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md"
                >
                    <Heart
                        className={`h-5 w-5 transition-all ${isWishlisted
                            ? 'fill-orange-500 text-orange-500 scale-110'
                            : 'text-gray-600'
                            }`}
                    />
                </motion.button>

                {/* Image */}
                <div className="relative overflow-hidden bg-white h-56 flex items-center justify-center">
                    <motion.img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex flex-col flex-grow">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 text-lg group-hover:text-orange-600">
                        {name}
                    </h3>

                    <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(ratings) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({numOfReviews})</span>
                    </div>

                    <span className="text-2xl font-bold text-orange-600">
                        ₹{Number(price).toLocaleString('en-IN')}
                    </span>

                    {stock <= 0 && <p className="text-sm text-red-600 font-medium">Out of Stock</p>}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        disabled={stock <= 0 || isAdding}
                        className={`w-full py-3 rounded-full font-semibold flex items-center justify-center space-x-2 mt-auto transition-all ${stock > 0
                            ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md hover:shadow-xl'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isAdding ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <Zap className="h-5 w-5" />
                            </motion.div>
                        ) : (
                            <>
                                <ShoppingCart className="h-5 w-5" />
                                <span>{stock > 0 ? 'Add to Cart' : 'Unavailable'}</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;