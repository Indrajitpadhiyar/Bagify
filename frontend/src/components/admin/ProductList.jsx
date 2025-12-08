import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAdminProducts, deleteProduct, clearErrors } from '../../redux/actions/product.Action';
import { DELETE_PRODUCT_RESET } from '../../redux/constans/product.Constans';
import AdminLayout from './AdminLayout';
import Loading from '../ui/Loading';
import toast from 'react-hot-toast';
import { Edit, Trash2, Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = () => {
    const dispatch = useDispatch();

    const { error, products, loading } = useSelector((state) => state.products);
    const { error: deleteError, isDeleted } = useSelector((state) => state.productMutation);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            toast.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            toast.success('Product Deleted Successfully');
            dispatch({ type: DELETE_PRODUCT_RESET });
        }

        dispatch(getAdminProducts());
    }, [dispatch, error, deleteError, isDeleted]);

    const deleteProductHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id));
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
                    <p className="text-gray-500 mt-1">Manage your store's inventory</p>
                </div>
                <Link
                    to="/admin/product/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
                >
                    <Plus size={20} />
                    Add New Product
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loading /></div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100/50 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Product ID</th>
                                    <th className="px-6 py-4 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-semibold">Stock</th>
                                    <th className="px-6 py-4 font-semibold">Price</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence>
                                    {products && products.map((product) => (
                                        <motion.tr
                                            key={product._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-orange-50/30 transition-colors group"
                                        >
                                            <td className="px-6 py-4 text-xs font-mono text-gray-400">{product._id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                                                {product.images && product.images[0] && (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                    />
                                                )}
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 0
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-700">₹{product.price}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <Link to={`/admin/product/${product._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteProductHandler(product._id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {products && products.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <AlertCircle size={40} className="text-gray-300" />
                                                <p>No products found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ProductList;
