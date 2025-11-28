// app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import fileUpload from "express-fileupload";   ← DELETE THIS LINE
import bodyParser from "body-parser";

import product from "./src/routes/product.routes.js";
import userRouter from "./src/routes/user.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import errorMiddlewares from "./src/middlewares/error.middlewares.js";

const app = express();

// Middlewares
app.use(express.json({ limit: "50mb" })); // increase limit
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Remove these lines completely:
// app.use(fileUpload({ ... }));
// app.use(bodyParser.urlencoded({ extended: true })); // duplicate

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
// Serve uploaded files (for local multer disk storage)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1", product);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);

// Error Middleware
app.use(errorMiddlewares);

app.get("/", (req, res) => {
  res.send("<h1>Bagify API is running!</h1>");
});

export default app;
