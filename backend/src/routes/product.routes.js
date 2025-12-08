import express, { Router } from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  deleteReview,
  getProductReviews,
} from "../controllers/product.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/auth.middlewares.js";
// import { upload } from "../middlewares/multer.middlewares.js";

const productRouter = express.Router();

productRouter.route("/products").get(getAllProducts);

productRouter
  .route("/products/create")
  .post(
    isAuthenticated,
    authorizeRoles("admin"),
    createProduct
  );

productRouter
  .route("/products/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);

productRouter.route("/product/:id").get(getProductDetails);

productRouter.route("/review").put(isAuthenticated, createProductReview);

productRouter
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticated, deleteReview);

export default productRouter;
