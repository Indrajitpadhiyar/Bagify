import mongoose from "mongoose";

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
});

const Config = mongoose.model("Config", configSchema);
export default Config;
