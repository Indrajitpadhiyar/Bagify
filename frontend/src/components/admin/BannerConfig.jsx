import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Monitor,
    Plus,
    RefreshCw,
    Save,
    Trash2,
} from 'lucide-react';
import API from '../../api/axiosClient';
import toast from 'react-hot-toast';

const toDateInputValue = (value) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
};

const formatHumanDate = (value) => {
    if (!value) return 'Not set';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const nowPlusDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

const createFreshOffer = () => ({
    title: 'New Offer',
    subtitle: 'Describe the special moment',
    discountLabel: 'Special Price',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    imageUrl: '',
    startDate: toDateInputValue(new Date()),
    endDate: toDateInputValue(nowPlusDays(7)),
    isActive: true,
});

const mapServerConfig = (shape) => {
    if (!shape) return {
        bannerTitle: '',
        bannerSubtitle: '',
        bannerLink: '/products',
        isActive: true,
        heroOffers: [],
    };

    const heroOffers = (shape.heroOffers || []).map((offer) => ({
        ...offer,
        startDate: toDateInputValue(offer.startDate),
        endDate: toDateInputValue(offer.endDate),
    }));

    return {
        bannerTitle: shape.bannerTitle || '',
        bannerSubtitle: shape.bannerSubtitle || '',
        bannerLink: shape.bannerLink || '/products',
        isActive: shape.isActive !== undefined ? shape.isActive : true,
        heroOffers,
    };
};

const OfferPreview = ({ offers = [], fallback }) => {
    const slides = useMemo(() => (offers || []).filter(Boolean), [offers]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!slides.length) {
            setCurrentIndex(0);
            return;
        }
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length && currentIndex >= slides.length) {
            setCurrentIndex(0);
        }
    }, [slides.length, currentIndex]);

    const activeSlide = slides.length ? slides[currentIndex] : fallback;
    const timelineText = activeSlide
        ? `${activeSlide.startDate ? formatHumanDate(activeSlide.startDate) : 'Start TBD'} — ${activeSlide.endDate ? formatHumanDate(activeSlide.endDate) : 'Open ended'}`
        : '';

    const hasSlides = slides.length > 0;

    return (
        <div className="relative h-96 overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: activeSlide?.imageUrl
                        ? `url(${activeSlide.imageUrl})`
                        : undefined,
                }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-between p-8">
                <div>
                    {activeSlide?.discountLabel && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/50 px-3 py-1 text-xs uppercase tracking-wider text-white/90">
                            {activeSlide.discountLabel}
                        </span>
                    )}
                    <h3 className="mt-4 text-4xl font-bold leading-tight">
                        {activeSlide?.title || fallback?.title || 'Summer Sale is Live!'}
                    </h3>
                    <p className="mt-3 text-lg text-white/80">
                        {activeSlide?.subtitle ||
                            fallback?.subtitle ||
                            'Create offers to keep this space fresh and exciting.'}
                    </p>
                </div>
                <div className="space-y-3">
                    {timelineText && (
                        <p className="flex items-center gap-2 text-sm text-white/80">
                            <Clock size={14} />
                            {timelineText}
                        </p>
                    )}
                    {activeSlide?.ctaText && (
                        <button className="inline-flex items-center gap-1 rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-orange-600 shadow-lg">
                            {activeSlide.ctaText}
                        </button>
                    )}
                </div>
            </div>
            {hasSlides && (
                <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="rounded-full bg-black/40 p-2 text-white hover:bg-black/70"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                        {slides.map((_, idx) => (
                            <span
                                key={idx}
                                className={`h-2 w-2 rounded-full transition ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
                        className="rounded-full bg-black/40 p-2 text-white hover:bg-black/70"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

const BannerConfig = () => {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        bannerTitle: '',
        bannerSubtitle: '',
        bannerLink: '/products',
        isActive: true,
        heroOffers: []
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/config/banner');
            if (data.success && data.config) {
                setConfig(mapServerConfig(data.config));
            }
        } catch (error) {
            toast.error("Failed to load banner settings");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleOfferChange = (index, field, value) => {
        setConfig(prev => {
            const updatedOffers = prev.heroOffers.map((offer, idx) =>
                idx === index ? { ...offer, [field]: value } : offer
            );
            return {
                ...prev,
                heroOffers: updatedOffers,
            };
        });
    };

    const handleAddOffer = () => {
        setConfig(prev => ({
            ...prev,
            heroOffers: [...(prev.heroOffers || []), createFreshOffer()],
        }));
    };

    const handleRemoveOffer = (index) => {
        setConfig(prev => ({
            ...prev,
            heroOffers: prev.heroOffers.filter((_, idx) => idx !== index),
        }));
    };

    const preparePayload = () => ({
        ...config,
        heroOffers: (config.heroOffers || []).map((offer) => ({
            ...offer,
            startDate: offer.startDate || undefined,
            endDate: offer.endDate || undefined,
        })),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await API.put('/admin/config/banner', preparePayload());
            if (data.success) {
                toast.success("Banner updated successfully!");
                setConfig(mapServerConfig(data.config));
            }
        } catch (error) {
            toast.error("Failed to update banner");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
                        <p className="text-gray-500 mt-1">Customize your "Hot Deals" banner and Summer Sale slider</p>
                    </div>
                    <button
                        onClick={fetchConfig}
                        className="p-2 text-gray-500 hover:text-orange-600 rounded-full hover:bg-orange-50 transition-colors"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Title</label>
                                <input
                                    name="bannerTitle"
                                    value={config.bannerTitle}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-outline outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Subtitle</label>
                                <textarea
                                    name="bannerSubtitle"
                                    value={config.bannerSubtitle}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-outline outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Link</label>
                                <input
                                    name="bannerLink"
                                    value={config.bannerLink}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-outline outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <h4 className="font-semibold text-gray-800">Banner Visibility</h4>
                                    <p className="text-sm text-gray-500">Show or hide the banner on Home page</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={config.isActive}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Hero Slider</h3>
                                    <p className="text-sm text-gray-500">Add, reorder, or pause offers that appear in the Summer Sale hero.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddOffer}
                                    className="inline-flex items-center gap-2 rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition"
                                >
                                    <Plus size={16} />
                                    Add Offer
                                </button>
                            </div>

                            {config.heroOffers.length > 0 ? (
                                <div className="space-y-4">
                                    {config.heroOffers.map((offer, index) => (
                                        <div key={`${offer._id || index}-${offer.title}`} className="space-y-4 rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-sm">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-xs uppercase tracking-wide text-gray-500">Slide {index + 1}</p>
                                                    <h4 className="text-lg font-semibold text-gray-800">{offer.title || 'Untitled offer'}</h4>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOffer(index)}
                                                    className="rounded-full p-1 text-red-500 transition hover:text-red-600"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <label className="text-sm text-gray-600 flex flex-col gap-2">
                                                    <span>Title</span>
                                                    <input
                                                        type="text"
                                                        value={offer.title || ''}
                                                        onChange={(e) => handleOfferChange(index, 'title', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                                                    />
                                                </label>
                                                <label className="text-sm text-gray-600 flex flex-col gap-2">
                                                    <span>Subtitle</span>
                                                    <input
                                                        type="text"
                                                        value={offer.subtitle || ''}
                                                        onChange={(e) => handleOfferChange(index, 'subtitle', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                                                    />
                                                </label>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <label className="text-sm text-gray-600 flex flex-col gap-2">
                                                    <span>Discount Label</span>
                                                    <input
                                                        type="text"
                                                        value={offer.discountLabel || ''}
                                                        onChange={(e) => handleOfferChange(index, 'discountLabel', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                                                    />
                                                </label>
                                                <label className="text-sm text-gray-600 flex flex-col gap-2">
                                                    <span>CTA Text</span>
                                                    <input
                                                        type="text"
                                                        value={offer.ctaText || ''}
                                                        onChange={(e) => handleOfferChange(index, 'ctaText', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                                                    />
                                                </label>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <label className="text-sm text-gray-600 flex flex-col gap-2">
                                                    <span>CTA Link</span>
                                                    <input
                                                        type="text"
                                                        value={offer.ctaLink || ''}
                                                        onChange={(e) => handleOfferChange(index, 'ctaLink', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                                                    />
                                                </label>
                                                <label className="text-sm text-gray-600 flex flex-col gap-2">
                                                    <span>Image URL</span>
                                                    <input
                                                        type="text"
                                                        value={offer.imageUrl || ''}
                                                        onChange={(e) => handleOfferChange(index, 'imageUrl', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                                                    />
                                                </label>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-3 md:items-center">
                                                <label className="text-sm text-gray-600 flex flex-col gap-2">
                                                    <span>Start Date</span>
                                                    <input
                                                        type="date"
                                                        value={offer.startDate || ''}
                                                        onChange={(e) => handleOfferChange(index, 'startDate', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                                                    />
                                                </label>
                                                <label className="text-sm text-gray-600 flex flex-col gap-2">
                                                    <span>End Date</span>
                                                    <input
                                                        type="date"
                                                        value={offer.endDate || ''}
                                                        onChange={(e) => handleOfferChange(index, 'endDate', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
                                                    />
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-600">Active</span>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!offer.isActive}
                                                            onChange={(e) => handleOfferChange(index, 'isActive', e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:ring-orange-300 peer-checked:bg-orange-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-md after:transition-all peer-checked:after:translate-x-full"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                                    <p className="font-semibold text-gray-700">No offers yet.</p>
                                    <p>Add a slide to preview it on the homepage.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-3 text-sm font-bold tracking-wide text-white shadow-lg transition hover:shadow-2xl disabled:opacity-70"
                            >
                                <Save size={20} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-bold text-gray-700">
                                <Monitor size={20} />
                                Live Preview
                            </div>
                            <OfferPreview
                                offers={config.heroOffers}
                                fallback={{
                                    title: config.bannerTitle || 'Summer Sale is Live!',
                                    subtitle: config.bannerSubtitle || "Grab these before they're gone!",
                                    ctaText: 'Shop Now',
                                    discountLabel: 'Limited Time',
                                    imageUrl: 'https://images.unsplash.com/photo-1481391020053-9f8d8ee3c333?auto=format&fit=crop&w=900&q=80',
                                    startDate: '',
                                    endDate: '',
                                }}
                            />
                        </div>
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-sm text-orange-800">
                            <strong>Note:</strong> Changes will be reflected immediately on the Hot Deals page.
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BannerConfig;
