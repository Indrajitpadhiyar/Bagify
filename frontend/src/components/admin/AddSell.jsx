import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from './AdminLayout';
import { getAdminProducts } from '../../redux/actions/product.Action';
import toast from 'react-hot-toast';
import { Sparkles, CalendarCheck } from 'lucide-react';

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
  }, [dispatch]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productId) {
      toast.error('Select a product to sell.');
      return;
    }
    if (!formData.originalPrice) {
      toast.error('Enter the original price.');
      return;
    }
    if (!formData.sellPrice) {
      toast.error('Enter the offer price.');
      return;
    }
    if (Number(formData.sellPrice) >= Number(formData.originalPrice)) {
      toast.error('Offer price must be lower than the original price.');
      return;
    }

    const selectedProduct = products.find((product) => product._id === formData.productId);
    const newOffer = {
      id: `${Date.now()}-${formData.productId}`,
      ...formData,
      discount: computedDiscount,
      productName: selectedProduct?.name || '',
    };

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setActiveOffers((prev) => [newOffer, ...prev]);
      setFormData({ ...initialSellForm });
      toast.success('Sell offer queued successfully.');
    }, 900);
  };

  const handleCancel = () => {
    setFormData({ ...initialSellForm });
    toast('Sell preparation canceled.', { icon: '👋' });
  };

  const removeOffer = (offerId) => {
    setActiveOffers((prev) => prev.filter((offer) => offer.id !== offerId));
    toast.success('Offer removed successfully.');
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
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 px-5 py-3 text-sm font-semibold text-orange-600 bg-white hover:bg-orange-50 transition"
                >
                  Cancel Sell
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6 w-full">
            <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white/80 p-5 shadow-xl space-y-4">
              <span className="text-xs uppercase tracking-[0.4em] text-orange-500">Product Peek</span>
              <p className="text-xl font-semibold text-orange-900">{selectedProduct ? selectedProduct.name : 'Select a product to preview'}</p>
              {selectedProduct && (
                <div className="space-y-2 text-sm text-orange-600">
                  <div className="flex items-center justify-between">
                    <span>Stock</span>
                    <strong>{selectedProduct.stock}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>MRP</span>
                    <strong>â‚¹{selectedProduct.originalPrice || selectedProduct.price}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Category</span>
                    <strong>{selectedProduct.category?.[0] || 'â€”'}</strong>
                  </div>
                </div>
              )}
            </div>
            <div className="rounded-3xl border border-orange-100 bg-white/90 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-orange-500">
                <span>Active Sell Offers</span>
                <CalendarCheck size={16} />
              </div>
              {activeOffers.length > 0 ? (
                <div className="space-y-4">
                  {activeOffers.map((offer) => (
                    <div key={offer.id} className="rounded-2xl border border-orange-100/70 p-4 bg-orange-50/70">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-orange-700">{offer.offerTitle || offer.productName}</p>
                          <p className="text-xs text-orange-500">Qty: {offer.quantity || 'N/A'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOffer(offer.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-orange-600">
                        <div className="flex items-center justify-between">
                          <span>Original</span>
                          <strong>â‚¹{offer.originalPrice || '0'}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Offer</span>
                          <strong>â‚¹{offer.sellPrice || '0'}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <strong>{offer.discount}%</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-orange-500">No active offers yet. Publish one to manage it here.</p>
              )}
            </div>
            <div className="rounded-3xl border border-orange-100 bg-white/90 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-orange-500">
                <span>Store stats</span>
                <CalendarCheck size={16} />
              </div>
              <div className="grid gap-3 text-sm font-semibold text-orange-700">
                <div className="flex items-center justify-between border-b border-orange-100/50 pb-2">
                  <span>Total products</span>
                  <strong>{stats.totalProducts}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>In stock</span>
                  <strong>{stats.inStock}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Low stock</span>
                  <strong>{stats.lowStock}</strong>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-orange-500">
                <span>Boosted by</span>
                <span>Bagify Pro</span>
              </div>
            </div>
          </aside>
        </div>
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
