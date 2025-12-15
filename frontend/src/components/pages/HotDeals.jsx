import ProductCard from '../ui/ProductCard';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Tag } from 'lucide-react';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, clearErrors } from '../../redux/actions/product.Action'


const HotDeals = () => {
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector((state) => state.allProduct || {});

    const [activeCategory, setActiveCategory] = useState('All');

    // Fetch products on mount
    useEffect(() => {
        dispatch(getProduct());
        return () => {
            dispatch(clearErrors());
        };
    }, [dispatch]);

    // Calculate discount percentage
    const calculateDiscount = (price, originalPrice) => {
        if (!originalPrice) return 0;
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    };

    // Filter Hot Deals: ≥30% discount OR ≥4.5 rating
    const hotDeals = (products || []).filter(product => {
        const discount = calculateDiscount(product.price, product.originalPrice);
        return discount >= 30 || product.ratings >= 4.5;
    });

    // Extract unique categories
    const categories = ['All', ...new Set(products?.map(p => p.category).filter(Boolean))];

    // Filter by category
    const filteredDeals = activeCategory === 'All'
        ? hotDeals
        : hotDeals.filter(p => p.category === activeCategory);

    // Loading State
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading hot deals...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Error State
    if (error) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                    <div className="text-center">
                        <Flame className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-red-600 mb-2">Oops! Something went wrong</h3>
                        <p className="text-gray-600 max-w-md">{error}</p>
                        <button
                            onClick={() => dispatch(getProduct())}
                            className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">

                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white py-20 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative max-w-7xl mx-auto px-4 text-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6"
                        >
                            <Flame className="w-5 h-5" />
                            <span className="font-bold">Hot Deals</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">Grab These Before They're Gone!</h1>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Limited time offers on trending products. Shop now and save up to 50%!
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-orange-500/25 transition-all"
                        >
                            <Zap className="w-5 h-5" />
                            Shop All Deals
                        </Link>
                    </div>

                    {/* Floating Icons */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full flex items-center justify-center"
                    >
                        <Tag className="w-8 h-8" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center"
                    >
                        <Flame className="w-6 h-6" />
                    </motion.div>
                </motion.section>

                {/* Category Filter */}
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Shop by Category</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {categories.map((cat) => (
                                <motion.button
                                    key={cat}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-3 rounded-full font-medium transition-all ${activeCategory === cat
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:shadow-md'
                                        }`}
                                >
                                    {cat}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Hot Deals Grid – Using Your ProductCard */}
                <section className="py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        {filteredDeals.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <Flame className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-600 mb-2">No hot deals right now</h3>
                                <p className="text-gray-500">Check back later for exciting offers!</p>
                                <Link to="/products" className="mt-6 inline-block text-orange-500 hover:underline">
                                    View All Products
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence>
                                    {filteredDeals.map((product, index) => (
                                        <motion.div
                                            key={product._id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -30 }}
                                            transition={{ delay: index * 0.1 }}
                                            layout
                                        >
                                            <ProductCard
                                                _id={product._id}
                                                name={product.name}
                                                price={product.price}
                                                images={product.images}
                                                stock={product.countInStock}
                                                ratings={product.ratings}
                                                numOfReviews={product.numOfReviews}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4">Don't Miss Out!</h2>
                        <p className="text-xl mb-8 opacity-90">Sign up for exclusive deals and flash sales</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-6 py-4 rounded-full text-black w-full sm:w-auto focus:outline-none focus:ring-4 focus:ring-white/30"
                            />
                            <button className="px-8 py-4 bg-white text-orange-600 rounded-full font-bold hover:shadow-xl transition-all">
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
};

export default HotDeals;