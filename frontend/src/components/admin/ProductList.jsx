import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAdminProducts, deleteProduct, clearErrors } from '../../redux/actions/product.Action';
import { DELETE_PRODUCT_RESET } from '../../redux/constans/product.Constans';
import AdminLayout from './AdminLayout';
import Loading from '../ui/Loading';
import toast from 'react-hot-toast';
import { Edit, Trash2, Plus, Search, Package } from 'lucide-react';
import ConfirmDialog from '../ui/ConfirmDialog';

const ProductList = () => {
    const dispatch = useDispatch();

    const { error, products, loading } = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.productMutation);

    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState('all'); // all, inStock, outOfStock
    const [dialog, setDialog] = useState({ isOpen: false, productId: null, productName: '' });

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
            toast.success('Product deleted successfully');
            dispatch({ type: DELETE_PRODUCT_RESET });
        }

        dispatch(getAdminProducts());
    }, [dispatch, error, deleteError, isDeleted]);

    // Search + Filter Logic
    const filteredProducts = products?.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStock =
            stockFilter === 'all' ||
            (stockFilter === 'inStock' && product.stock > 0) ||
            (stockFilter === 'outOfStock' && product.stock === 0);
        return matchesSearch && matchesStock;
    });

    const openDeleteDialog = (id, name) => {
        setDialog({ isOpen: true, productId: id, productName: name });
    };

    const closeDialog = () => {
        setDialog({ isOpen: false, productId: null, productName: '' });
    };

    const confirmDelete = () => {
        dispatch(deleteProduct(dialog.productId));
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
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

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                        />
                    </div>

                    {/* Stock Filter */}
                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    >
                        <option value="all">All Products</option>
                        <option value="inStock">In Stock Only</option>
                        <option value="outOfStock">Out of Stock</option>
                    </select>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredProducts?.length || 0} of {products?.length || 0} products
                </div>
            </div>

            {/* Products Table */}
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
                                {filteredProducts?.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <motion.tr
                                            key={product._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-orange-50/30 transition-colors group"
                                        >
                                            <td className="px-6 py-4 text-xs font-mono text-gray-400">{product._id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                                                {product.images?.[0]?.url ? (
                                                    <img src={product.images[0].url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                        <Package size={20} className="text-orange-500" />
                                                    </div>
                                                )}
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${product.stock > 0
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {product.stock === 0 ? 'Out of Stock' : product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-700">₹{product.price.toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        to={`/admin/product/${product._id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => openDeleteDialog(product._id, product.name)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-16 text-gray-500">
                                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                            <p className="text-lg">No products found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Beautiful Confirm Dialog */}
            <ConfirmDialog
                isOpen={dialog.isOpen}
                onClose={closeDialog}
                onConfirm={confirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${dialog.productName}"? This action cannot be undone.`}
                confirmText="Delete Product"
            />
        </AdminLayout>
    );
};

export default ProductList;