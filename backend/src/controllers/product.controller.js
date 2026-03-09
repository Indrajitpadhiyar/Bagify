import Product from "../models/product.model.js";
import ErrorHandler from "../utils/error.handler.js";
import catchAsyncError from "../middlewares/catchAysncerror.middleware.js";
import ApiFeatures from "../utils/apiFeatures.js";

import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";


//create product-admin

export const createProduct = async (req, res) => {
  try {
    // Debug: inspect incoming payload (helps when using Postman / non-multipart requests)
    console.log("createProduct req.body:", req.body);
    console.log("createProduct req.files:", req.files);

    const { name, price, originalPrice, description, category, stock } = req.body;

    const isEmptyValue = (value) =>
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0);

    // Accept 0 as a valid numeric value (e.g. price or stock) but reject empty strings/arrays
    if (
      isEmptyValue(name) ||
      isEmptyValue(price) ||
      isEmptyValue(description) ||
      isEmptyValue(category) ||
      isEmptyValue(stock)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // If originalPrice is missing, default it to price so the product still creates
    const originalPriceValue = isEmptyValue(originalPrice) ? price : originalPrice;

    // Accept pre-uploaded images in JSON payload (e.g. Postman testing) or uploaded files
    let imagesLinks = [];

    if (req.body.images && Array.isArray(req.body.images) && req.body.images.length) {
      imagesLinks = req.body.images
        .map((img) => {
          if (!img) return null;
          if (typeof img === "string") {
            return { public_id: "", url: img };
          }
          return {
            public_id: img.public_id || "",
            url: img.url || img.secure_url || "",
          };
        })
        .filter((img) => img && img.url);
    }

    // Handle images from express-fileupload
    if ((!imagesLinks || imagesLinks.length === 0) && req.files && req.files.images) {
      const images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const canUseCloudinary =
        process.env.CLOUDINARY_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET;

      // Ensure local upload directory exists (fallback storage)
      const uploadDir = path.join(process.cwd(), "uploads", "products");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      for (let i = 0; i < images.length; i++) {
        const file = images[i];

        const storeLocally = async () => {
          const ext = path.extname(file.name) || ".jpg";
          const fileName = `${Date.now()}-${i}${ext}`;
          const destPath = path.join(uploadDir, fileName);

          // Rename may fail across devices (EXDEV). Copy + remove is safer.
          try {
            await fs.promises.rename(file.tempFilePath, destPath);
          } catch (err) {
            if (err.code === "EXDEV") {
              await fs.promises.copyFile(file.tempFilePath, destPath);
              await fs.promises.unlink(file.tempFilePath);
            } else {
              throw err;
            }
          }

          const host = req.get("host");
          const protocol = req.protocol;
          imagesLinks.push({
            public_id: fileName,
            url: `${protocol}://${host}/uploads/products/${fileName}`,
          });
        };

        if (canUseCloudinary) {
          try {
            const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
              folder: "products",
            });

            imagesLinks.push({
              public_id: result.public_id,
              url: result.secure_url,
            });
            continue;
          } catch (err) {
            console.warn(
              "Cloudinary upload failed, falling back to local storage:",
              err.message || err
            );
            await storeLocally();
            continue;
          }
        }

        // If Cloudinary is not configured, store locally
        await storeLocally();
      }
    }

    if (!imagesLinks || imagesLinks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    const categoryValues = Array.isArray(category) ? category : [category];
    const stockValue = Number(stock);

    const product = await Product.create({
      name,
      price: Number(price),
      originalPrice: Number(originalPriceValue),
      description,
      category: categoryValues,
      stock: Number.isNaN(stockValue) ? 1 : stockValue,
      images: imagesLinks,
      user: req.user._id,
      seller: req.user._id,
    });

    console.log("Create Product Success:", product);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    // Convert common validation errors to client errors
    const statusCode =
      error.name === "ValidationError" || error.name === "CastError" ? 400 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Server Error",
      error: error.name,
      detail: error.errors || error.error?.message || error.message,
    });
  }
};
// get all products
export const getAllProducts = catchAsyncError(async (req, res) => {
  const resultsPerPage = Number(req.query.limit) || 12;

  // Total products in the collection (for UI overview)
  const productCount = await Product.countDocuments();

  // Apply search + filtering before pagination
  const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter();

  // Count after filters (before pagination)
  const filteredProductsCount = await Product.countDocuments(
    apiFeatures.query.getFilter ? apiFeatures.query.getFilter() : apiFeatures.query._conditions
  );

  // Apply pagination
  apiFeatures.pagination(resultsPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
    filteredProductsCount,
    resultsPerPage,
    currentPage: Number(req.query.page) || 1,
  });
});

//total products number

export const getProductsCount = catchAsyncError(async (req, res, next) => {
  const productsCount = await Product.countDocuments();
  res.status(200).json({
    success: true,
    productsCount,
  });
});

// update product - admin

export const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });

  console.log("Product updated successfully");
});

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      console: console.log("Error deleting product:", error),
    });
  }
};

export const getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//create New review or update the review
export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  if (!productId) {
    return next(new ErrorHandler("Product ID is required", 400));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  // Ensure reviews array exists before accessing it
  product.reviews = Array.isArray(product.reviews) ? product.reviews : [];

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = product.reviews.length > 0 ? avg / product.reviews.length : 0;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get all reviews of a product
export const getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete review
export const deleteReview = catchAsyncError(async (req, res, next) => {
  const { id: reviewId, productId } = req.query;

  if (!productId) {
    return next(new ErrorHandler("Product ID is required", 400));
  }
  if (!reviewId) {
    return next(new ErrorHandler("Review ID is required", 400));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = (product.reviews || []).filter(
    (rev) => rev._id.toString() !== reviewId.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = reviews.length > 0 ? avg / reviews.length : 0;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
