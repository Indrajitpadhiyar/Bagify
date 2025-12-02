import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { X, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import { removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart as addToCartAction } from '../../redux/slices/cartSlice';

const Wishlist = () => {
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(addToCartAction({ ...item, qty: 1 }));
    dispatch(removeFromWishlist(item._id));
  };

  if (wishlistItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
          <div className="text-center">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-700">Your wishlist is empty</h2>
            <p className="text-gray-500 mt-2">Save your favorite items for later!</p>
            <Link to="/products" className="mt-8 inline-block px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-orange-600 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 fill-orange-500 text-orange-500" />
            My Wishlist
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-lg p-6 flex gap-4"
              >
                <img src={item.image} alt={item.name} className="w-28 h-28 object-contain rounded-lg" />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                  <p className="text-2xl font-bold text-orange-600 mt-2">₹{item.price.toLocaleString()}</p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full font-medium flex items-center justify-center gap-2 hover:shadow-lg"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => dispatch(removeFromWishlist(item._id))}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;