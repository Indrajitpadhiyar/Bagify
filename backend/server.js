// server.js
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import cloudinary from "cloudinary";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import dns from "node:dns";

const PORT = process.env.PORT || 4000;

dns.setServers(["1.1.1.1"]);
// 🔹 Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 DB Connect

console.log("Mongo URI exists:", !!process.env.MONGO_URI);
await connectDB();

// 🔹 Server + Socket.IO helpers
let httpServer;
let io;

const createServerAndSockets = () => {
  httpServer = http.createServer(app);

  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

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
};

export { io };

// 🔹 Start Server (with port conflict handling)
const defaultPort = Number(process.env.PORT) || 4000;
let portToUse = defaultPort;
const maxPortAttempts = 5;
let attemptCount = 0;

const startServer = () => {
  if (attemptCount >= maxPortAttempts) {
    console.error(
      `🚫 Unable to start server after ${maxPortAttempts} attempts. Please free up port ${defaultPort} or set PORT in .env.`
    );
    process.exit(1);
  }

  attemptCount += 1;

  // Create fresh server/socket instance for this attempt
  createServerAndSockets();

  httpServer.listen(portToUse, () => {
    console.log(`🚀 Server running on http://localhost:${portToUse}`);
  });

  httpServer.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`⚠️ Port ${portToUse} is already in use. Trying port ${portToUse + 1}...`);
      portToUse += 1;
      // Close the previous server before retrying
      httpServer.close(() => startServer());
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
};

startServer();

// 🔹 Graceful Shutdown
const shutdown = (signal) => {
  console.log(`${signal} received - shutting down`);
  if (httpServer) {
    httpServer.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  if (httpServer) {
    httpServer.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
