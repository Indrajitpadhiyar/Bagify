import Config from "../models/config.model.js";
import catchAsyncError from "../middlewares/catchAysncerror.middleware.js";

// Get Banner Config (Public)
export const getBannerConfig = catchAsyncError(async (req, res, next) => {
    let config = await Config.findOne();

    if (!config) {
        config = await Config.create({});
    }

    res.status(200).json({
        success: true,
        config,
    });
});

// Update Banner Config (Admin)
export const updateBannerConfig = catchAsyncError(async (req, res, next) => {
    let config = await Config.findOne();

    if (!config) {
        config = await Config.create(req.body);
    } else {
        config = await Config.findOneAndUpdate({}, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
    }

    res.status(200).json({
        success: true,
        config,
    });
});
