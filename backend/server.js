// server.js
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import cloudinary from "cloudinary";

import app from "./app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 4000;

// 🔹 Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 DB Connect
connectDB();

// 🔹 HTTP Server
const server = http.createServer(app);

// 🔹 Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

export { io };

// 🔹 Socket Events
io.on("connection", (socket) => {
  console.log("🟢 New Client Connected:", socket.id);

  socket.on("join_order", (orderId) => {
    socket.join(orderId);
    console.log(`📦 Socket ${socket.id} joined room: ${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client Disconnected:", socket.id);
  });
});

// 🔹 Start Server
const httpServer = server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// 🔹 Graceful Shutdown
process.on("SIGINT", () => {
  console.log("SIGINT received - shutting down");
  httpServer.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received - shutting down");
  httpServer.close(() => process.exit(0));
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  httpServer.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
