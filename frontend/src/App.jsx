import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './redux/actions/user.Action';
import Home from './components/pages/Home';
import AllProducts from './components/pages/AllProducts';
import ProductDetails from './components/pages/ProductDetails';
import SearchResults from './components/pages/SearchResults';
import LoginSignUp from './components/pages/LoginSignUp';
import Profile from './components/pages/Profile';
import Cart from './components/pages/Cart';
import Wishlist from './components/pages/Wishlist';
import HotDeals from './components/pages/HotDeals';
import MyOrder from './components/pages/MyOrder';
import AdminOverview from './components/admin/AdminOverview';
import ProductList from './components/admin/ProductList';
import NewProduct from './components/admin/AddProduct';
import AdminOrders from "./components/admin/AdminOrders";
import AdminOrderDetails from "./components/admin/AdminOrderDetails";
import UserList from "./components/admin/UserList";
// import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import ProtectedRoute from './components/routes/ProtectedRoute';


import './App.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load user when app starts
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
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
        {/* <Route path="/password/forgot" element={<ForgotPassword />} /> */}

        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route element={<ProtectedRoute isAdmin={true} />}>
          <Route path="/admin/dashboard" element={<AdminOverview />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product/new" element={<NewProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/order/:id" element={<AdminOrderDetails />} />
          <Route path="/admin/users" element={<UsersList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;