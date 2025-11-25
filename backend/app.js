// app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import product from "./src/routes/product.routes.js";
import userRouter from "./src/routes/user.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import errorMiddlewares from "./src/middlewares/error.middlewares.js";

const app = express();

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://bagify-48n8.onrender.com"],
    credentials: true,
  })
);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1", product);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);

// Fallback for routes not found
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found: ${req.originalUrl}`,
  });
});

// Error Middleware
app.use(errorMiddlewares);

app.get("/", (req, res) => {
  res.send("<h1>Bagify API is running!</h1>");
});

export default app;
