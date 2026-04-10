import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from './AdminLayout';
import { getAdminProducts } from '../../redux/actions/product.Action';
import toast from 'react-hot-toast';
import { Sparkles, CalendarCheck, Flame, Trash2 } from 'lucide-react';
import API from '../../api/axiosClient';

const initialSellForm = {
  offerTitle: '',
  productId: '',
  originalPrice: '',
  sellPrice: '',
  quantity: '',
  discount: '',
  startDate: '',
  endDate: '',
  description: '',
};

const AddSell = ({ hideLayout = false }) => {
  const dispatch = useDispatch();
  const { products = [], loading: productsLoading } = useSelector((state) => state.products || {});
  const [formData, setFormData] = useState(() => ({ ...initialSellForm }));
  const [submitting, setSubmitting] = useState(false);
  const [activeOffers, setActiveOffers] = useState([]);

  const computedDiscount = useMemo(() => {
    const original = Number(formData.originalPrice);
    const sale = Number(formData.sellPrice);
    if (!original || !sale || sale >= original) return 0;
    return Math.round(((original - sale) / original) * 100);
  }, [formData.originalPrice, formData.sellPrice]);

  useEffect(() => {
    dispatch(getAdminProducts());
    fetchSellOffers();
  }, [dispatch]);

  const fetchSellOffers = async () => {
    try {
      const { data } = await API.get('/config/banner');
      if (data.success && data.config?.sellOffers) {
        setActiveOffers(data.config.sellOffers);
      }
    } catch (error) {
      console.error('Failed to fetch sell offers', error);
    }
  };

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const inStock = products.filter((p) => p.stock > 0).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    return { totalProducts, inStock, lowStock };
  }, [products]);

  const selectedProduct = products.find((product) => product._id === formData.productId);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'productId') {
      const selected = products.find((product) => product._id === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        originalPrice: selected ? selected.originalPrice || selected.price || '' : '',
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId) {
      toast.error('Select a product to sell.');
      return;
    }
    if (!formData.sellPrice) {
      toast.error('Enter the offer price.');
      return;
    }

    const selectedProduct = products.find((product) => product._id === formData.productId);
    const newOffer = {
      ...formData,
      discount: computedDiscount,
      productName: selectedProduct?.name || '',
    };

    try {
      setSubmitting(true);
      const updatedOffers = [newOffer, ...activeOffers];
      
      // Update config with new sell list
      const { data } = await API.put('/admin/config/banner', {
        sellOffers: updatedOffers.map(o => ({
           ...o,
           productId: o.productId?._id || o.productId // handle populated vs raw ID
        }))
      });

      if (data.success) {
        setActiveOffers(data.config.sellOffers);
        setFormData({ ...initialSellForm });
        toast.success('Sell offer published successfully.');
      }
    } catch (error) {
      toast.error('Failed to publish sell offer.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...initialSellForm });
    toast('Sell preparation canceled.', { icon: '👋' });
  };

  const removeOffer = async (index) => {
    try {
      setSubmitting(true);
      // Fetch latest config to avoid overwriting other fields (like heroOffers)
      const { data: currentData } = await API.get('/config/banner');
      const currentConfig = currentData.config || {};
      
      const updatedSellOffers = activeOffers.filter((_, idx) => idx !== index);
      
      const payload = {
        ...currentConfig,
        sellOffers: updatedSellOffers.map(o => ({
           ...o,
           productId: o.productId?._id || o.productId
        }))
      };

      const { data } = await API.put('/admin/config/banner', payload);

      if (data.success) {
        setActiveOffers(data.config.sellOffers);
        toast.success('Offer removed successfully.');
      }
    } catch (error) {
      toast.error('Failed to remove offer.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <>
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
            <p className="text-lg font-semibold text-gray-800">Publishing sell offer...</p>
            <p className="text-sm text-gray-500">Almost ready for launch.</p>
          </div>
        </div>
      )}

      <div className="space-y-8 max-w-6xl mx-auto flex flex-col items-center w-full">
        <header className="rounded-3xl bg-gradient-to-br from-orange-100 via-white to-white shadow-2xl border border-orange-100 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-orange-500">Sell Center</p>
            <h1 className="text-3xl font-extrabold text-orange-900 flex items-center gap-3">
              <Sparkles size={28} /> Add Sell Offer
            </h1>
            <p className="text-sm text-orange-600 max-w-2xl mt-1">
              Bundle a fresh product, spotlight a limited stock, and create urgency with an offer that matches your brand glow.
            </p>
          </div>
          <div className="text-right text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold">Live + curated</div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] w-full">
          <section className="bg-white/95 border border-orange-100 rounded-3xl shadow-2xl p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-orange-600">Offer Title</label>
                  <input
                    name="offerTitle"
                    value={formData.offerTitle}
                    onChange={handleChange}
                    placeholder="Autumn Flash Sell"
                    className="mt-2 w-full rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-orange-600">Select Product</label>
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  >
                    <option value="">Choose product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="text-sm font-semibold text-orange-600">Original Price (â‚¹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="e.g. 1999"
                    className="mt-2 w-full rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-orange-600">Offer Price (â‚¹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="sellPrice"
                    value={formData.sellPrice}
                    onChange={handleChange}
                    placeholder="e.g. 1599"
                    className="mt-2 w-full rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-orange-600">Discount (%)</label>
                  <input
                    type="number"
                    value={computedDiscount}
                    readOnly
                    className="mt-2 w-full rounded-2xl border border-orange-100 bg-orange-100/70 px-4 py-3 text-sm text-orange-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-orange-600">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-orange-600">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-orange-600">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Add short sell message or highlight ingredients."
                  className="mt-2 w-full rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={productsLoading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Sparkles size={18} />
                  Publish Sell Offer
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('manage-offers')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-600 bg-white hover:bg-orange-50 transition"
                >
                  <CalendarCheck size={18} />
                  Manage Existing
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6 w-full">
            <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white/80 p-5 shadow-xl space-y-4">
              <span className="text-xs uppercase tracking-[0.4em] text-orange-500">Quick Tools</span>
              <div className="space-y-2">
                <button
                  onClick={() => document.getElementById('manage-offers')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full text-left p-3 rounded-xl bg-white border border-orange-100 hover:bg-orange-50 transition text-sm font-semibold text-orange-700 flex items-center justify-between"
                >
                  Manage/Delete Offers <CalendarCheck size={16} />
                </button>
                <button
                  onClick={() => setFormData({ ...initialSellForm })}
                  className="w-full text-left p-3 rounded-xl bg-orange-50/50 border border-orange-100 hover:bg-orange-50 transition text-sm font-semibold text-orange-600 flex items-center justify-between"
                >
                  Reset Form <Flame size={16} />
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Unified Management Section */}
        <section id="manage-offers" className="w-full space-y-6 pt-10">
          <div className="rounded-3xl border border-orange-100 bg-white/95 p-6 shadow-2xl space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-orange-900 flex items-center gap-3">
                  <Trash2 size={24} className="text-red-500" /> Remove Old/Active Offers
                </h2>
                <p className="text-sm text-orange-600 mt-1">Found an old offer? Clear it here to update the home page instantly.</p>
              </div>
              <div className="flex gap-2">
                {activeOffers.some(o => o.endDate && new Date(o.endDate).getTime() < Date.now()) && (
                  <button
                    onClick={async () => {
                      if (window.confirm('Delete all expired offers?')) {
                        const fresh = activeOffers.filter(o => !o.endDate || new Date(o.endDate).getTime() >= Date.now());
                        try {
                          const { data } = await API.put('/admin/config/banner', {
                            sellOffers: fresh.map(o => ({ ...o, productId: o.productId?._id || o.productId }))
                          });
                          if (data.success) {
                            setActiveOffers(data.config.sellOffers);
                            toast.success('Expired offers cleaned.');
                          }
                        } catch (err) { toast.error('Failed to clean.'); }
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition border border-red-100"
                  >
                    Clear All Expired
                  </button>
                )}
              </div>
            </header>

            {activeOffers.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeOffers.map((offer, index) => {
                  const isExpired = offer.endDate && new Date(offer.endDate).getTime() < Date.now();
                  return (
                    <div key={offer._id || index} className={`relative group rounded-2xl border transition-all duration-300 ${isExpired ? 'bg-gray-50 border-gray-200 grayscale-[0.5]' : 'bg-white border-orange-100 hover:shadow-xl hover:-translate-y-1'}`}>
                      <div className="p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-bold text-orange-900 leading-tight">
                              {offer.offerTitle || offer.productName || offer.productId?.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md uppercase">
                                {offer.discount}% OFF
                              </span>
                              {isExpired && (
                                <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-md uppercase">
                                  Expired
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeOffer(index)}
                            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove this offer"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="flex items-end justify-between">
                          <div className="space-y-1">
                            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Pricing</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-black text-orange-700">₹{offer.sellPrice}</span>
                              <span className="text-xs text-gray-400 line-through">₹{offer.originalPrice}</span>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-gray-400 font-bold uppercase">Expires</p>
                             <p className="text-xs font-semibold text-gray-600">{offer.endDate ? new Date(offer.endDate).toLocaleDateString() : 'Never'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3 bg-orange-50/20 rounded-3xl border border-dashed border-orange-100">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm">
                   <Flame className="text-orange-200" />
                </div>
                <p className="text-orange-900 font-bold text-lg">Clean Slate!</p>
                <p className="text-sm text-orange-500">No active or old offers are currently saved. Use the form above to add one.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );

  return hideLayout ? content : (
    <AdminLayout>
      {content}
    </AdminLayout>
  );

};

export default AddSell;
