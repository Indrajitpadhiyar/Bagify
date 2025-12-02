// src/components/ui/SearchDropdown.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchDropdown = ({
    query,
    results,
    isOpen,
    onSelect,
    onClose,
}) => {
    // Close when clicking outside
    React.useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (!e.target.closest('.search-dropdown')) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const hasExact = results.some(
        (p) => p.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="search-dropdown absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50"
            >
                {results.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                        No products found for "<strong>{query}</strong>"
                    </div>
                ) : (
                    <ul className="max-h-96 overflow-y-auto">
                        {results.map((product, idx) => (
                            <motion.li
                                key={product._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                            >
                                <Link
                                    to={`/product/${product._id}`}
                                    onClick={() => {
                                        onSelect();
                                        onClose();
                                    }}
                                    className="flex items-center gap-4 px-5 py-3 hover:bg-orange-50 transition-colors"
                                >
                                    <img
                                        src={product.images?.[0]?.url || '/placeholder.jpg'}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            ₹{product.price?.toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            </motion.li>
                        ))}
                        {!hasExact && query && (
                            <li className="px-5 py-2 text-xs text-gray-400 italic">
                                Showing related results
                            </li>
                        )}
                    </ul>
                )}
                {/* "View all" footer */}
                {query && results.length > 0 && (
                    <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                        <Link
                            to={`/search?q=${encodeURIComponent(query)}`}
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 text-orange-600 font-medium hover:underline"
                        >
                            <Search className="w-4 h-4" />
                            View all results for "{query}"
                        </Link>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default SearchDropdown;