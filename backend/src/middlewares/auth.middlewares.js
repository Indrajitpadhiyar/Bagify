import jwt from "jsonwebtoken";
import catchAsyncError from "./catchAysncerror.middleware.js";
import ErrorHandler from "../utils/error.handler.js";
import User from "../models/user.model.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;

  // 1️⃣ HEADER ME DEKHO
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ COOKIE ME DEKHO
  if (!token) {
    token = req.cookies.token;
  }

  // 3️⃣ TOKEN STILL NA MILE TO ERROR
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  let decodedData;
  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decodedData);
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }

  req.user = await User.findById(decodedData.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }

  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
