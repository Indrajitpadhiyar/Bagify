import { io } from "socket.io-client";

// Replace with your backend URL
const SOCKET_URL = "http://localhost:4000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;
