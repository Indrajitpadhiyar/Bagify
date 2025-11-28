import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

import product from "./src/routes/product.routes.js";
import userRouter from "./src/routes/user.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import errorMiddlewares from "./src/middlewares/error.middlewares.js";

const app = express();

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ⭐ REQUIRED for Cloudinary avatar upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

const allowedOrigins = [
  "http://localhost:5173",
  "https://bagify-z9wj.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Serve multer uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1", product);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);

// Error handler
app.use(errorMiddlewares);

app.get("/", (req, res) => {
  res.send("<h1>Bagify API is running!</h1>");
});

export default app;
