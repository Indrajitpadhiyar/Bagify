import mongoose from "mongoose";

const addDays = (base, days) => new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

const createDefaultHeroOffers = () => {
    const now = new Date();
    return [
        {
            title: "Summer Sale is Live!",
            subtitle: "Save up to 60% on top picks for every trip.",
            discountLabel: "Up to 60% OFF",
            ctaText: "Shop Now",
            ctaLink: "/products",
            imageUrl:
                "https://images.unsplash.com/photo-1481391020053-9f8d8ee3c333?auto=format&fit=crop&w=900&q=80",
            startDate: now,
            endDate: addDays(now, 7),
            isActive: true,
        },
        {
            title: "Fresh Arrivals",
            subtitle: "New drops curated for summer adventures.",
            discountLabel: "Extra 25% OFF",
            ctaText: "Explore",
            ctaLink: "/products?sort=new",
            imageUrl:
                "https://images.unsplash.com/photo-1458253329476-1ebb8593a652?auto=format&fit=crop&w=900&q=80",
            startDate: addDays(now, 1),
            endDate: addDays(now, 14),
            isActive: true,
        },
    ];
};

const heroOfferSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
        default: "",
    },
    discountLabel: {
        type: String,
        trim: true,
        default: "",
    },
    ctaText: {
        type: String,
        trim: true,
        default: "Shop Now",
    },
    ctaLink: {
        type: String,
        trim: true,
        default: "/products",
    },
    imageUrl: {
        type: String,
        trim: true,
        default:
            "https://images.unsplash.com/photo-1481391020053-9f8d8ee3c333?auto=format&fit=crop&w=900&q=80",
    },
    startDate: {
        type: Date,
        default: () => new Date(),
    },
    endDate: {
        type: Date,
        default: () => addDays(new Date(), 7),
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

const sellOfferSchema = new mongoose.Schema({
    offerTitle: {
        type: String,
        trim: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    originalPrice: Number,
    sellPrice: Number,
    quantity: Number,
    discount: Number,
    startDate: Date,
    endDate: Date,
    description: String,
    isActive: {
        type: Boolean,
        default: true,
    },
});

const configSchema = new mongoose.Schema({
    bannerTitle: {
        type: String,
        default: "Summer Sale is Live!",
    },
    bannerSubtitle: {
        type: String,
        default: "Grab These Before They're Gone!",
    },
    bannerLink: {
        type: String,
        default: "/products",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    heroOffers: {
        type: [heroOfferSchema],
        default: [],
    },
    sellOffers: {
        type: [sellOfferSchema],
        default: [],
    },
});

const Config = mongoose.model("Config", configSchema);

export default Config;
export { createDefaultHeroOffers };
