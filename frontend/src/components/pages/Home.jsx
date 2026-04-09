import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import { Zap, Shield, Truck, Star, ChevronLeft, ChevronRight, ArrowRight, Clock } from 'lucide-react';
import Products from '../layouts/Products';
import MetaData from '../ui/MetaData';
import API from '../../api/axiosClient';

const heroFallbackSlide = {
    title: 'Summer Sale is Live!',
    subtitle: 'Save up to 60% on top brands. Limited time only!',
    discountLabel: 'Up to 60% OFF',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    startDate: null,
    endDate: null,
};

const isOfferCurrentlyActive = (offer) => {
    if (!offer) return false;
    if (offer.isActive === false) return false;
    const now = Date.now();
    if (offer.startDate) {
        const start = new Date(offer.startDate).getTime();
        if (!Number.isNaN(start) && now < start) return false;
    }
    if (offer.endDate) {
        const end = new Date(offer.endDate).getTime();
        if (!Number.isNaN(end) && now > end) return false;
    }
    return true;
};

const formatDateLabel = (value) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const heroRangeLabel = (offer) => {
    if (!offer) return '';
    const start = offer.startDate ? formatDateLabel(offer.startDate) : 'Start TBD';
    const end = offer.endDate ? formatDateLabel(offer.endDate) : 'Open ended';
    if (!offer.startDate && !offer.endDate) return '';
    return `${start} — ${end}`;
};

const daysLeftLabel = (offer) => {
    if (!offer?.endDate) return null;
    const end = new Date(offer.endDate).getTime();
    if (Number.isNaN(end)) return null;
    const diff = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Ends today';
    return diff === 0 ? 'Ends today' : `${diff} day${diff === 1 ? '' : 's'} left`;
};

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

    const [heroOffers, setHeroOffers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchHeroConfig = async () => {
            try {
                const { data } = await API.get('/config/banner');
                if (data.success) {
                    const offers = Array.isArray(data.config?.heroOffers) ? data.config.heroOffers : [];
                    setHeroOffers(offers);
                }
            } catch (error) {
                console.error("Failed to fetch hero configuration", error);
            }
        };

        fetchHeroConfig();
    }, []);

    const heroSlides = useMemo(() => heroOffers.filter(isOfferCurrentlyActive), [heroOffers]);
    const carouselSlides = heroSlides.length ? heroSlides : [heroFallbackSlide];

    useEffect(() => {
        if (!carouselSlides.length) {
            setCurrentIndex(0);
            return;
        }
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [carouselSlides.length]);

    useEffect(() => {
        if (currentIndex >= carouselSlides.length) {
            setCurrentIndex(0);
        }
    }, [carouselSlides.length, currentIndex]);

    const handlePrevSlide = () => {
        if (!carouselSlides.length) return;
        setCurrentIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    };

    const handleNextSlide = () => {
        if (!carouselSlides.length) return;
        setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
    };

    const activeSlide = carouselSlides[currentIndex] || heroFallbackSlide;
    const rangeLabel = heroRangeLabel(activeSlide);
    const countdownLabel = daysLeftLabel(activeSlide);
    const badgeLabel = activeSlide?.discountLabel || heroFallbackSlide.discountLabel;

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
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                {badgeLabel && (
                                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-orange-600">
                                        {badgeLabel}
                                    </span>
                                )}
                                <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
                                    {activeSlide.title || heroFallbackSlide.title}
                                </h1>
                                <p className="text-xl text-gray-600">
                                    {activeSlide.subtitle || heroFallbackSlide.subtitle}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        to={activeSlide.ctaLink || '/products'}
                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-2xl transition"
                                    >
                                        <span>{activeSlide.ctaText || heroFallbackSlide.ctaText}</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        to="/deals"
                                        className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-3 text-orange-600 font-semibold hover:bg-orange-50 transition"
                                    >
                                        <Zap className="h-5 w-5" />
                                        <span>View Deals</span>
                                    </Link>
                                </motion.div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                {rangeLabel && (
                                    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700">
                                        <Clock size={14} />
                                        <span>{rangeLabel}</span>
                                    </div>
                                )}
                                {countdownLabel && (
                                    <div className="rounded-full border border-dashed border-orange-400 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                                        {countdownLabel}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handlePrevSlide}
                                    className="rounded-full border border-orange-200 bg-white/90 p-2 text-orange-600 shadow-md transition hover:bg-white"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex items-center gap-2">
                                    {carouselSlides.map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`h-2 w-2 rounded-full transition ${idx === currentIndex ? 'bg-orange-600' : 'bg-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleNextSlide}
                                    className="rounded-full border border-orange-200 bg-white/90 p-2 text-orange-600 shadow-md transition hover:bg-white"
                                >
                                    <ChevronRight size={20} />
                                </button>
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
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-orange-200 to-yellow-200 p-6 shadow-2xl">
                                <img
                                    src={activeSlide.imageUrl || heroFallbackSlide.imageUrl}
                                    alt={activeSlide.title || 'Featured Product'}
                                    className="w-full h-96 object-contain rounded-2xl"
                                />
                                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                                    {badgeLabel}
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
