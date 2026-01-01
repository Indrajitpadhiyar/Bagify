import crypto from "crypto";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/error.handler.js";
import catchAsyncError from "../middlewares/catchAysncerror.middleware.js";
import sendToken from "../utils/JWTtoken.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Register a user

export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // ---- avatar handling ----
  let avatar = { public_id: "default", url: "https://via.placeholder.com/150" };

  if (req.files && req.files.avatar) {
    const file = req.files.avatar;
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "avatar",
      width: 150,
      crop: "scale",
    });
    avatar = { public_id: result.public_id, url: result.secure_url };
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  sendToken(user, 201, res);
});
// Login User
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get resetPassword token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Point to frontend URL - Assuming frontend runs on port 5173 by default for Vite
  // Ideally this should come from process.env.FRONTEND_URL
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Bagify Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // If email fails (e.g. no config), log it to console for development
    console.log("❌ Email sending failed (likely missing config).");
    console.log("------------------------------------------");
    console.log("🔥 DEV MODE - PASSWORD RESET LINK:");
    console.log(resetPasswordUrl);
    console.log("------------------------------------------");

    // CRITICAL: Do NOT delete the token from the user document!
    // We want the developer to be able to use the link we just logged.

    // Return 200 OK so the frontend shows the "Success" message
    // and doesn't display "Internal Server Error"
    res.status(200).json({
      success: true,
      message: `(Dev Mode) Check Backend Terminal for Link!`,
    });
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  //created token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset password token is invalid or has been expired", 401)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

//get all user details

export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//update password

export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//update profile

export const updateProfile = catchAsyncError(async (req, res, next) => {
  console.log("🔍 updateProfile called");
  console.log("  Body:", req.body);
  console.log("  Files:", req.files);

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    shippingInfo: {
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country || "India",
      pinCode: req.body.pinCode,
      phoneNo: req.body.phoneNo,
    },
  };

  // Handle Avatar (Fixed: use req.files.avatar for express-fileupload)
  if (req.files?.avatar) {
    console.log("✅ Avatar file detected");
    const avatarFile = req.files.avatar;
    const user = await User.findById(req.user.id);

    if (user.avatar?.public_id && user.avatar.public_id !== "default") {
      console.log("🗑️ Deleting old avatar");
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    console.log("☁️ Uploading to Cloudinary...");
    const result = await cloudinary.v2.uploader.upload(
      avatarFile.tempFilePath,
      {
        folder: "avatars",
        width: 150,
        crop: "scale",
      }
    );

    console.log("✅ Upload successful:", result.secure_url);

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } else {
    console.log("⚠️ No avatar file in request");
  }

  console.log("🔍 Updating user with dataaaaa:", newUserData);

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  console.log("✅ Profile updated successfully", user);

  res.status(200).json({
    success: true,
    user,
  });
});
// get all users (admin)
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// get single users (admin)
export const getSigleUser = catchAsyncError(async (req, res, next) => {
  const users = await User.findById(req.params.id);

  if (!users) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    users,
  });
});

// update user role -- admin
export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.role = req.body.role;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Role changed to ${req.body.role.toUpperCase()}`,
  });
});
// delete user -- admin
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  // we will remove cloudnary later

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const addToCart = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { productId } = req.body;

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if the product is already in the cart
  const isProductInCart = user.addToCart.find(
    (item) => item.productId.toString() === productId
  );

  if (isProductInCart) {
    return next(new ErrorHandler("Product is already in cart", 400));
  }

  user.addToCart.push({ productId });
  await user.save();

  res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
  });
});

export const removeFromCart = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { productId } = req.body;

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const initialLength = user.addToCart.length;

  user.addToCart = user.addToCart.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  if (user.addToCart.length === initialLength) {
    return next(new ErrorHandler("Product not found in cart", 404));
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    cart: user.addToCart,
  });
});

export const getCart = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("addToCart.productId");

  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }
  res.status(200).json({
    success: true,
    cart: user.addToCart,
  });
});
