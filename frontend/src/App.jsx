import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './redux/actions/user.Action';
import BackButton from './components/ui/BackButton';
import Home from './components/pages/Home';
import AllProducts from './components/pages/AllProducts';
import ProductDetails from './components/pages/ProductDetails';
import SearchResults from './components/pages/SearchResults';
import LoginSignUp from './components/pages/LoginSignUp';
import Profile from './components/pages/Profile';
import Cart from './components/pages/Cart';
import Wishlist from './components/pages/Wishlist';
import PageNotFound from './components/PageNotFound';
import HotDeals from './components/pages/HotDeals';
import MyOrder from './components/pages/MyOrder';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import ProtectedRoute from './components/routes/ProtectedRoute';


import './App.css';
import AdminLayout from './components/admin/AdminLayout';

const AdminOverview = lazy(() => import('./components/admin/AdminOverview'));
const ProductList = lazy(() => import('./components/admin/ProductList'));
const NewProduct = lazy(() => import('./components/admin/AddProduct'));
const AddSellOffer = lazy(() => import('./components/admin/AddSell'));
const AdminOrders = lazy(() => import('./components/admin/AdminOrders'));
const AdminOrderDetails = lazy(() => import('./components/admin/AdminOrderDetails'));
const UsersList = lazy(() => import('./components/admin/UsersList'));
const BannerConfig = lazy(() => import('./components/admin/BannerConfig'));

const SuspendedRoute = ({ children }) => (
  <Suspense
    fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
        <span className="text-lg font-semibold text-orange-600">Loading admin panel...</span>
      </div>
    }
  >
    {children}
  </Suspense>
);

const AdminRouteWrapper = ({ children }) => (
  <SuspendedRoute>
    <AdminLayout>{children}</AdminLayout>
  </SuspendedRoute>
);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load user when app starts
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <BackButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/deals" element={<HotDeals />} />
        <Route path="/profile/orders" element={<MyOrder />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />

        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path="/admin/dashboard" element={<AdminRouteWrapper><AdminOverview /></AdminRouteWrapper>} />
          <Route path="/admin/products" element={<AdminRouteWrapper><ProductList /></AdminRouteWrapper>} />
          <Route path="/admin/product/new" element={<AdminRouteWrapper><NewProduct /></AdminRouteWrapper>} />
          <Route path="/admin/sell" element={<AdminRouteWrapper><AddSellOffer /></AdminRouteWrapper>} />
          <Route path="/admin/orders" element={<AdminRouteWrapper><AdminOrders /></AdminRouteWrapper>} />
          <Route path="/admin/order/:id" element={<AdminRouteWrapper><AdminOrderDetails /></AdminRouteWrapper>} />
          <Route path="/admin/users" element={<AdminRouteWrapper><UsersList /></AdminRouteWrapper>} />
          <Route path="/admin/banner" element={<AdminRouteWrapper><BannerConfig /></AdminRouteWrapper>} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
