import Product from "../models/product.model.js";
import ErrorHandler from "../utils/error.handler.js";
import catchAsyncError from "../middlewares/catchAysncerror.middleware.js";
import ApiFeatures from "../utils/apiFeatures.js";

//create product-admin

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, images: imageLinks } = req.body;

    let finalImages = [];

    if (!name || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // If files uploaded → multer
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        finalImages.push({
          public_id: file.filename,
          url: `http://localhost:4000/${file.path}`, // ← this works only if you serve /uploads
        });
      });
    }

    // If links are provided → JSON array or single link
    if (imageLinks) {
      let parsedLinks = [];

      if (typeof imageLinks === "string") {
        parsedLinks = JSON.parse(imageLinks);
      } else {
        parsedLinks = imageLinks;
      }

      parsedLinks.forEach((img) => {
        finalImages.push({
          public_id: "url_image",
          url: img.url,
        });
      });
    }

    console.log("Product created successfully");
    if (finalImages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload at least one image" });
    }

    return res.json({
      success: true,
      message: "Product created successfully",
      images: finalImages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// get all products
export const getAllProducts = catchAsyncError(async (req, res) => {
  // const resultsPerPage = 8;
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  // .pagination(resultsPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
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

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
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
  product.ratings = avg / product.reviews.length;
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

//delete review
export const deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length;

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
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
