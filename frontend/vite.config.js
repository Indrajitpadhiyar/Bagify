import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000" || "https://bagifybackend.onrender.com",
        changeOrigin: true,
        secure: false,
      },
      "/uploads":
        "http://localhost:4000" || "https://bagifybackend.onrender.com",
    },
  },
});
