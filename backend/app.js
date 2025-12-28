import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import os from "os";

import product from "./src/routes/product.routes.js";
import userRouter from "./src/routes/user.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import errorMiddlewares from "./src/middlewares/error.middlewares.js";

const app = express();

// Body parsers

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Cloudinary file upload

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);
// CORS (VERY IMPORTANT)

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://bagify-z9wj.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Static files

app.use("/uploads", express.static("uploads"));

// Routes

app.use("/api/v1", product);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);

// Test route

app.get("/", (req, res) => {
  res.send("<h1>Bagify API is running!</h1>");
});

// Error middleware (LAST)

app.use(errorMiddlewares);

export default app;
