import express from "express";
import {
    getBannerConfig,
    updateBannerConfig,
} from "../controllers/config.controller.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.route("/config/banner").get(getBannerConfig);
router
    .route("/admin/config/banner")
    .put(isAuthenticated, authorizeRoles("admin"), updateBannerConfig);

export default router;
