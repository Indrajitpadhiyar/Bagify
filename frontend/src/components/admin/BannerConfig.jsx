import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Save, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import API from '../../api/axiosClient';
import toast from 'react-hot-toast';

const BannerConfig = () => {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({
        bannerTitle: '',
        bannerSubtitle: '',
        bannerLink: '/products',
        isActive: true
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/config/banner');
            if (data.success && data.config) {
                setConfig(data.config);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await API.put('/admin/config/banner', config);
            if (data.success) {
                toast.success("Banner updated successfully!");
                setConfig(data.config);
            }
        } catch (error) {
            toast.error("Failed to update banner");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
                        <p className="text-gray-500 mt-1">Customize your "Hot Deals" banner</p>
                    </div>
                    <button
                        onClick={fetchConfig}
                        className="p-2 text-gray-500 hover:text-orange-600 rounded-full hover:bg-orange-50 transition-colors"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-70"
                            >
                                <Save size={20} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>

                    {/* Preview */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                            <Monitor size={20} />
                            Live Preview
                        </h3>

                        <div className="rounded-3xl overflow-hidden shadow-2xl relative bg-gradient-to-r from-orange-500 to-red-500 text-white">
                            <div className="absolute inset-0 bg-black/10" />
                            <div className="relative p-8 text-center py-16">
                                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-4">
                                    Hot Deals
                                </span>
                                <h1 className="text-3xl font-bold mb-2">{config.bannerTitle || "Summer Sale is Live!"}</h1>
                                <p className="opacity-90 mb-6">{config.bannerSubtitle || "Grab these before they're gone!"}</p>
                                <button className="px-6 py-2 bg-white text-orange-600 rounded-full font-bold shadow-lg">
                                    Shop Now
                                </button>
                            </div>
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
