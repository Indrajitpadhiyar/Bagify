import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { getProduct } from '../../redux/actions/product.Action';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../ui/ProductCard';
import Loading from '../ui/Loading';

const Products = () => {
    const dispatch = useDispatch();
    const { loading, error, products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch]);

    return (
        <section className="py-20 bg-gray-50">
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

                {/* LOADING STATE */}
                {loading && (
                    <div className="flex items-center justify-center py-10">
                        <Loading />
                    </div>
                )}

                {/* ERROR STATE */}
                {error && (
                    <div className="text-center py-10 text-red-600 font-medium">
                        Error: {error}
                    </div>
                )}

                {/* PRODUCTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((product, i) => (
                            <motion.div
                                key={product.id || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <ProductCard {...product} />
                            </motion.div>
                        ))
                    ) : (
                        !loading && (
                            <p className="col-span-full text-center text-gray-500 py-10">
                                No products found.
                            </p>
                        )
                    )}
                </div>

                {/* VIEW ALL BUTTON */}
                <div className="text-center mt-12">
                    <motion.a
                        href="/products"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                        <span>View All Products</span>
                        <ChevronRight className="h-5 w-5" />
                    </motion.a>
                </div>
            </div>
        </section>
    );
};

export default Products;