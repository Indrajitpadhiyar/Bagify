import React from 'react';
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import { Zap, Shield, Truck, Star, ChevronRight, ArrowRight } from 'lucide-react';
import Products from '../layouts/Products';
import MetaData from '../ui/MetaData';

const Home = () => {
    const heroFeatures = [
        { icon: Truck, label: 'Free Shipping', desc: 'On orders over $50' },
        { icon: Shield, label: 'Secure Payment', desc: '100% protected' },
        { icon: Zap, label: 'Fast Delivery', desc: 'Same-day dispatch' },
    ];

    const testimonials = [
        { name: "Sarah K.", role: "Designer", text: "Best shopping experience ever! Fast shipping and amazing quality.", rating: 5 },
        { name: "Mike Chen", role: "Developer", text: "Love the deals and customer support. Will definitely shop again!", rating: 5 },
        { name: "Emma L.", role: "Student", text: "Got my earbuds in 2 days. Sound is incredible for the price!", rating: 5 },
    ];

    return (
        <>
            <MetaData title="Bagify" />
            {/* NAVBAR */}
            <Navbar />

            {/* HERO SECTION */}
            <section className="bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-20">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                                Summer Sale is <span className="text-orange-600">Live!</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Save up to <strong className="text-orange-600">60%</strong> on top brands. Limited time only!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.a
                                    href="/products"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                                >
                                    <span>Shop Now</span>
                                    <ArrowRight className="h-5 w-5" />
                                </motion.a>
                                <motion.a
                                    href="/deals"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white text-orange-600 font-bold rounded-full shadow-md hover:shadow-lg border-2 border-orange-500 transition-all flex items-center justify-center space-x-2"
                                >
                                    <Zap className="h-5 w-5" />
                                    <span>View Deals</span>
                                </motion.a>
                            </div>

                            {/* Hero Features */}
                            <div className="mt-10 grid grid-cols-3 gap-4">
                                {heroFeatures.map((feat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/80 backdrop-blur-md p-4 rounded-xl text-center shadow-sm"
                                    >
                                        <feat.icon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                        <p className="font-semibold text-gray-800 text-sm">{feat.label}</p>
                                        <p className="text-xs text-gray-500">{feat.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-tr from-orange-200 to-yellow-200 rounded-3xl p-8 shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Featured Product"
                                    className="w-full h-96 object-contain rounded-2xl"
                                />
                                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                                    60% OFF
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            {/* <section className="py-20 bg-gray-50">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
                        <p className="text-lg text-gray-600">Handpicked just for you</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <ProductCard {...product} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <motion.a
                            href="/shop"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center space-x-2 px-8 py-4 bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                        >
                            <span>View All Products</span>
                            <ChevronRight className="h-5 w-5" />
                        </motion.a>
                    </div>
                </div>
            </section> */}
            <Products />

            {/* TESTIMONIALS */}
            <section className="py-20 bg-white">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
                        <p className="text-lg text-gray-600">Real reviews from real shoppers</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-orange-50 p-6 rounded-2xl shadow-md border border-orange-100"
                            >
                                <div className="flex mb-4">
                                    {[...Array(t.rating)].map((_, s) => (
                                        <Star key={s} className="h-5 w-5 fill-orange-400 text-orange-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">"{t.text}"</p>
                                <div>
                                    <p className="font-bold text-gray-800">{t.name}</p>
                                    <p className="text-sm text-gray-500">{t.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default Home;