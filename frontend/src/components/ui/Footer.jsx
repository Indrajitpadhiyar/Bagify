import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ChevronUp,
    ChevronDown,
    Truck,
    Shield,
    CreditCard,
    Headphones,
    ArrowUp,
} from 'lucide-react';

const Footer = () => {
    const [openSection, setOpenSection] = useState(null);

    const footerLinks = {
        shop: [
            { label: 'New Arrivals', href: '/new' },
            { label: 'Best Sellers', href: '/bestsellers' },
            { label: 'Flash Sale', href: '/sale' },
            { label: 'Gift Cards', href: '/giftcards' },
        ],
        categories: [
            { label: 'Electronics', href: '/electronics' },
            { label: 'Fashion', href: '/fashion' },
            { label: 'Home & Living', href: '/home' },
            { label: 'Beauty', href: '/beauty' },
        ],
        support: [
            { label: 'Help Center', href: '/help' },
            { label: 'Track Order', href: '/track' },
            { label: 'Returns', href: '/returns' },
            { label: 'Contact Us', href: '/contact' },
        ],
        company: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press', href: '/press' },
            { label: 'Sustainability', href: '/sustainable' },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Youtube, href: '#', label: 'YouTube' },
    ];

    const features = [
        { icon: Truck, label: 'Free Shipping', desc: 'On orders over $50' },
        { icon: Shield, label: 'Secure Payment', desc: 'SSL Encrypted' },
        { icon: CreditCard, label: 'Easy Returns', desc: '30-day policy' },
        { icon: Headphones, label: '24/7 Support', desc: 'Live chat & email' },
    ];

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer className="bg-white mt-20 border-t border-gray-100">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* MAIN CONTENT */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

                    {/* LOGO + NEWSLETTER */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center space-x-4 mb-6"
                        >
                            <div className="relative">
                                <img
                                    src="/bagifyLogo.png"
                                    alt="ShopZone Logo"
                                    className="h-16 w-16 object-contain rounded-xl shadow-md bg-white p-2 border border-orange-200"
                                />
                                <div className="absolute -inset-1 bg-gradient-to-tr from-orange-400 to-yellow-400 rounded-xl blur-lg opacity-30 -z-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">BagiFy</h3>
                                <p className="text-xs text-gray-500">Fast • Fresh • Fun</p>
                            </div>
                        </motion.div>

                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            Get exclusive deals, early drops, and VIP perks delivered straight to your inbox.
                        </p>

                        {/* NEWSLETTER FORM */}
                        <form className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Mail className="absolute left-4 top-4 h-5 w-5 text-orange-500" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all shadow-sm border border-gray-200"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                            >
                                Subscribe
                            </motion.button>
                        </form>
                    </div>

                    {/* DESKTOP LINKS */}
                    {Object.entries(footerLinks).map(([key, links], colIndex) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: colIndex * 0.1 }}
                            className="hidden lg:block"
                        >
                            <h4 className="font-bold text-gray-800 mb-5 uppercase text-sm tracking-wider">
                                {key === 'shop' ? 'Shop' : key === 'support' ? 'Support' : key === 'company' ? 'Company' : 'Categories'}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-gray-600 hover:text-orange-600 transition-colors text-sm font-medium flex items-center group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* MOBILE ACCORDION */}
                    <div className="lg:hidden space-y-3">
                        {Object.entries(footerLinks).map(([key, links]) => (
                            <div key={key} className="border-b border-gray-100 pb-3">
                                <button
                                    onClick={() => toggleSection(key)}
                                    className="w-full flex items-center justify-between py-3 text-left font-bold text-gray-800"
                                >
                                    <span className="uppercase text-sm tracking-wider">
                                        {key === 'shop' ? 'Shop' : key === 'support' ? 'Support' : key === 'company' ? 'Company' : 'Categories'}
                                    </span>
                                    {openSection === key ? (
                                        <ChevronUp className="h-5 w-5 text-orange-600" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openSection === key && (
                                        <motion.ul
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden pb-2"
                                        >
                                            {links.map((link) => (
                                                <li key={link.label} className="py-2">
                                                    <a
                                                        href={link.href}
                                                        className="text-gray-600 hover:text-orange-600 transition-colors text-sm pl-4 border-l-2 border-transparent hover:border-orange-400"
                                                    >
                                                        {link.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FEATURES GRID (Desktop/Tablet) */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 py-10 border-y border-gray-100">
                    {features.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center space-x-4 p-4 bg-orange-50 rounded-2xl border border-orange-100"
                        >
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl text-white shadow-md">
                                <feat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{feat.label}</p>
                                <p className="text-xs text-gray-600">{feat.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* BOTTOM BAR */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100 text-sm text-gray-600">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4 md:mb-0">
                        <a href="/privacy" className="hover:text-orange-600 transition-colors">Privacy</a>
                        <span className="hidden md:inline">·</span>
                        <a href="/terms" className="hover:text-orange-600 transition-colors">Terms</a>
                        <span className="hidden md:inline">·</span>
                        <a href="/cookies" className="hover:text-orange-600 transition-colors">Cookies</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm">Follow us:</span>
                        <div className="flex space-x-2">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener"
                                    whileHover={{ scale: 1.2, rotate: 8 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2.5 bg-orange-100 rounded-full text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                                >
                                    <social.icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COPYRIGHT + BACK TO TOP */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
                    <p>
                        © {new Date().getFullYear()} <span className="font-bold text-orange-600">ShopZone</span>. All rights reserved.
                    </p>
                    <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="mt-3 sm:mt-0 flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-medium"
                    >
                        <ArrowUp className="h-4 w-4" />
                        <span>Back to Top</span>
                    </motion.button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;