import React, { useState, useEffect } from 'react';
import { Menu, Filter, Search, ShoppingBag, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from "react-hot-toast";
import { getProduct } from '../../redux/actions/product.Action';
import Navbar from '../ui/Navbar';
import Sidebar from '../layouts/Sidebar';
import ProductCard from '../ui/ProductCard';
import Footer from '../ui/Footer';
import Loading from '../ui/Loading';

const AllProducts = () => {
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector((state) => state.products);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({
        categories: [],
        brands: [],
        priceRange: [0, 1000000],
        customMin: '',
        customMax: '',
    });
    const [sortBy, setSortBy] = useState('featured');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

    // Fetch products from Redux
    useEffect(() => {
        if (error) {
            toast.error(error);
        } else {
            dispatch(getProduct());
        }
    }, [dispatch, error,]);

    // Filter products based on active filters
    const filteredProducts = Array.isArray(products) ? products.filter(product => {
        // Price filter
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
            return false;
        }

        // Category filter
        if (filters.categories.length > 0 && product.category && !filters.categories.includes(product.category)) {
            return false;
        }

        // Brand filter
        if (filters.brands.length > 0 && product.brand && !filters.brands.includes(product.brand)) {
            return false;
        }

        return true;
    }) : [];

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return (b.ratings || 0) - (a.ratings || 0);
            case 'newest':
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            default:
                return 0;
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, endIndex);

    const displayStartIndex = startIndex + 1;
    const displayEndIndex = Math.min(endIndex, sortedProducts.length);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const clearAllFilters = () => {
        setFilters({
            categories: [],
            brands: [],
            priceRange: [0, 10000],
            customMin: '',
            customMax: '',
        });
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* NAVBAR */}
            <Navbar />

            {/* MAIN CONTENT */}
            <div className="flex relative">
                {/* SIDEBAR */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    filters={filters}
                    setFilters={handleFilterChange}
                />

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 lg:ml-0 transition-all duration-300">
                    <div className="p-4 md:p-6 lg:p-8">
                        {/* HEADER */}
                        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Filter className="w-5 h-5" />
                                    Filters
                                </button>

                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">All Products</h1>
                                    {!loading && sortedProducts.length > 0 && (
                                        <p className="text-gray-600 text-sm">
                                            Showing {displayStartIndex}-{displayEndIndex} of {sortedProducts.length} products
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* SORT DROPDOWN */}
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setCurrentPage(1);
                                }}
                                disabled={loading}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-700 text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="featured">Sort by: Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Rating: High to Low</option>
                                <option value="newest">Newest First</option>
                            </select>
                        </div>

                        {/* ACTIVE FILTERS DISPLAY (Mobile) - Only show when filters are active */}
                        {(filters.categories.length > 0 || filters.brands.length > 0) && (
                            <div className="mb-4 lg:hidden">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-gray-700">Active:</span>
                                    {filters.categories.slice(0, 2).map(cat => (
                                        <span key={cat} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs capitalize">
                                            {cat}
                                        </span>
                                    ))}
                                    {filters.categories.length > 2 && (
                                        <span className="text-xs text-gray-500">+{filters.categories.length - 2} more</span>
                                    )}
                                    {filters.brands.slice(0, 1).map(brand => (
                                        <span key={brand} className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs">
                                            {brand}
                                        </span>
                                    ))}
                                    {filters.brands.length > 1 && (
                                        <span className="text-xs text-gray-500">+{filters.brands.length - 1} more</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* LOADING STATE */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loading />
                                <p className="text-gray-600 font-medium mt-4">Loading products...</p>
                            </div>
                        )}

                        {/* ERROR STATE */}
                        {error && !loading && (
                            <div className="text-center py-20">
                                <div className="text-red-400 mb-4">
                                    <ShoppingBag className="w-20 h-20 mx-auto" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Error loading products</h3>
                                <p className="text-gray-500 mb-4">{error}</p>
                                <button
                                    onClick={() => dispatch(getProduct())}
                                    className="px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* PRODUCTS GRID */}
                        {!loading && !error && currentProducts.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                {currentProducts.map((product) => (
                                    <ProductCard
                                        key={product._id || product.id}
                                        _id={product._id || product.id}
                                        name={product.name}
                                        price={product.price}
                                        description={product.description}
                                        ratings={product.ratings}
                                        images={product.images}
                                        stock={product.stock}
                                        numOfReviews={product.numOfReviews}
                                    />
                                ))}
                            </div>
                        )}

                        {/* EMPTY STATE */}
                        {!loading && !error && sortedProducts.length === 0 && (
                            <div className="text-center py-20">
                                <div className="text-gray-400 mb-4">
                                    <ShoppingBag className="w-20 h-20 mx-auto" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-4">
                                    {products && products.length > 0
                                        ? 'Try adjusting your filters'
                                        : 'No products available at the moment'
                                    }
                                </p>
                                {products && products.length > 0 && (filters.categories.length > 0 || filters.brands.length > 0) && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}

                        {/* PAGINATION */}
                        {!loading && !error && sortedProducts.length > 0 && totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors text-sm font-medium ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === pageNumber
                                                    ? 'bg-orange-600 text-white shadow-md'
                                                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    } else if (
                                        pageNumber === currentPage - 2 ||
                                        pageNumber === currentPage + 2
                                    ) {
                                        return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors text-sm font-medium ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <Footer />
        </div>
    );
};

export default AllProducts;