import ErrorHandler from "../utils/error.handler.js";

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`
    err = new ErrorHandler(message, 400)
  }


  //mongodb duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`
    err = new ErrorHandler(message, 400)
  }

  //wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again`
    err = new ErrorHandler(message, 400)
  }

  //jwt expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again`
    err = new ErrorHandler(message, 400)
  }

  if (err.statusCode === 500) {
    console.error("🔥 INTERNAL SERVER ERROR:", err);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
