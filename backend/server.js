// server.js
import "dotenv/config";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import cloudinary from "cloudinary";

const PORT = process.env.PORT || 5000;

// Cloudinary Config (after dotenv)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to DB
connectDB();

import { Server } from "socket.io";
import http from "http";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Add your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

export { io };

io.on("connection", (socket) => {
  console.log("New Client Connected:", socket.id);

  socket.on("join_order", (orderId) => {
    socket.join(orderId);
    console.log(`Socket ${socket.id} joined order room: ${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client Disconnected:", socket.id);
  });
});

// Start Server
const startServer = server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("SIGINT received - shutting down");
  startServer.close(() => process.exit(0));
});
process.on("SIGTERM", () => {
  console.log("SIGTERM received - shutting down");
  startServer.close(() => process.exit(0));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  startServer.close(() => process.exit(1));
});
