import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts } from '../../redux/actions/product.Action';
import { getAllUsers } from '../../redux/actions/user.Action';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  PackagePlus,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

// Animation Variants (same as before)
const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const item = { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 110 } } };

// Reusable Components (unchanged)
const StatCard = ({ title, value, icon, onClick, to, color = "orange", bgFrom = "orange" }) => {
  const Content = () => (
    <div className={`bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-orange-600 text-sm font-semibold uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-extrabold text-orange-900 mt-3">{value}</p>
        </div>
        <div className={`p-5 rounded-2xl bg-gradient-to-br from-${bgFrom}-100 to-${bgFrom}-50 shadow-inner`}>
          <div className={`text-${color}-600`}>{icon}</div>
        </div>
      </div>
      <div className="mt-5 flex items-center text-orange-700 font-medium">
        <span>View All</span>
        <ArrowRight size={18} className="ml-2" />
      </div>
    </div>
  );

  return (
    <motion.div variants={item} whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.98 }}>
      {to ? (
        <Link to={to} className="block">
          <Content />
        </Link>
      ) : (
        <div onClick={onClick} className="block cursor-pointer">
          <Content />
        </div>
      )}
    </motion.div>
  );
};

const ProductCard = ({ product }) => (
  <motion.div whileHover={{ y: -8, scale: 1.03 }} className="bg-white rounded-xl overflow-hidden border border-orange-200 shadow-md hover:shadow-xl transition">
    {product.images?.[0]?.url ? (
      <img src={product.images[0].url} alt={product.name} className="w-full h-44 object-cover" />
    ) : (
      <div className="w-full h-44 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
        <PackagePlus size={48} className="text-orange-300" />
      </div>
    )}
    <div className="p-5">
      <h4 className="font-bold text-orange-900 text-lg truncate">{product.name}</h4>
      <p className="text-3xl font-extrabold text-orange-600 mt-2">₹{product.price}</p>
      <div className="flex justify-between items-center mt-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
          {product.stock > 0 ? `${product.stock} left` : "Out of Stock"}
        </span>
      </div>
    </div>
  </motion.div>
);

const UserItem = ({ user }) => (
  <motion.div whileHover={{ x: 8 }} className="flex items-center gap-4 p-5 bg-gradient-to-r from-orange-50 to-white rounded-2xl border border-orange-200">
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
      {user.avatar?.url ? <img src={user.avatar.url} alt="" className="w-full h-full object-cover" /> : user.name[0].toUpperCase()}
    </div>
    <div className="flex-1">
      <p className="font-bold text-orange-900">{user.name}</p>
      <p className="text-sm text-orange-600">{user.email}</p>
    </div>
    {user.role === "admin" && (
      <span className="px-4 py-2 bg-orange-200 text-orange-800 rounded-full text-xs font-bold">ADMIN</span>
    )}
  </motion.div>
);

const AdminOverview = () => {
  const dispatch = useDispatch();
  const { products = [], loading: productsLoading } = useSelector((state) => state.products || {});
  const { users = [], loading: usersLoading } = useSelector((state) => state.allUsers || {});

  const [viewMode, setViewMode] = useState("dashboard"); // "dashboard" or "products"

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllUsers());
  }, [dispatch]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalRevenue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const inStock = totalProducts - outOfStock;
    return { totalProducts, totalRevenue, outOfStock, lowStock, inStock };
  }, [products]);

  const loading = productsLoading || usersLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-20 w-20 border-8 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-10 pb-10">
      {/* Header with Back Button */}
      <div className="relative flex justify-center items-center">
        <motion.div variants={item} className="text-center">
          <h1 className="text-5xl font-extrabold  bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl text-orange-600 mt-3">Real-time overview of your store</p>
        </motion.div>

        {/* Back Button - Only when viewing full products */}
        {viewMode === "products" && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setViewMode("dashboard")}
            className="absolute right-0 top-4 flex items-center gap-2 px-5 py-3 bg-orange-500 text-white rounded-xl font-semibold shadow-lg hover:bg-orange-600 transition"
          >
            <ArrowLeft size={20} />
            Back
          </motion.button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<ShoppingBag size={32} />}
          to="/admin/products"
        />
        <StatCard
          title="Total Users"
          value={users.length}
          icon={<Users size={32} />}
          to="/admin/users"
          color="blue"
          bgFrom="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          icon={<IndianRupee size={32} />}
          to="/admin/orders"
          color="green"
          bgFrom="emerald"
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStock}
          icon={<AlertTriangle size={32} />}
          to="/admin/products"
          color="red"
          bgFrom="red"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <motion.div variants={item} className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center shadow-md">
          <CheckCircle size={36} className="text-green-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-green-700">{stats.inStock}</p>
          <p className="text-green-600 font-medium">In Stock</p>
        </motion.div>
        <motion.div variants={item} className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl p-6 text-center shadow-md">
          <AlertTriangle size={36} className="text-yellow-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-yellow-700">{stats.lowStock}</p>
          <p className="text-yellow-600 font-medium">Low Stock</p>
        </motion.div>
        <motion.div variants={item} className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 text-center shadow-md">
          <PackagePlus size={36} className="text-orange-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-orange-700">
            {products.length > 0 ? Math.round((stats.inStock / products.length) * 100) : 0}%
          </p>
          <p className="text-orange-600 font-medium">Stock Rate</p>
        </motion.div>
        <motion.div variants={item} className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 text-center shadow-md">
          <Users size={36} className="text-purple-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-purple-700">
            {users.filter(u => u.role === "admin").length}
          </p>
          <p className="text-purple-600 font-medium">Admins</p>
        </motion.div>
      </div>

      {/* Conditional Content: Dashboard View vs Full Products */}
      {viewMode === "dashboard" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={item} className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-orange-900 mb-6 flex items-center gap-3">
              <PackagePlus size={36} /> Latest Products
            </h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.slice(0, 6).map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-orange-50 rounded-3xl border-4 border-dashed border-orange-300">
                <p className="text-2xl text-orange-600 font-medium">No products yet. Start adding!</p>
              </div>
            )}
          </motion.div>

          <motion.div variants={item}>
            <h2 className="text-3xl font-bold text-orange-900 mb-6 flex items-center gap-3">
              <Users size={36} /> Recent Users
            </h2>
            <div className="space-y-4">
              {users.length > 0 ? users.slice(0, 6).map(user => <UserItem key={user._id} user={user} />) : (
                <div className="text-center py-16 bg-orange-50 rounded-3xl border-4 border-dashed border-orange-300">
                  <p className="text-2xl text-orange-600">No users yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      ) : (
        /* Full Products View */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h2 className="text-4xl font-bold text-orange-900 flex items-center gap-3">
            <PackagePlus size={40} /> All Products ({stats.totalProducts})
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-orange-50 rounded-3xl border-4 border-dashed border-orange-300">
              <p className="text-3xl text-orange-600 font-medium">No products found</p>
            </div>
          )}
        </motion.div>
      )}

      {/* CTA Button - Only in dashboard mode */}
      {viewMode === "dashboard" && (
        <motion.div variants={item} className="text-center mt-12">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-300"
          >
            Go to Full Admin Panel <ArrowRight size={28} />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminOverview;