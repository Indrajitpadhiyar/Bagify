import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store";
import { Toaster } from "react-hot-toast";
import "./index.css";

import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              background: "#fff",
              color: "#000",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              animation: "slidePop 0.5s ease-out",
            },
            success: {
              iconTheme: {
                primary: "#16a34a",
                secondary: "#fff",
              },
              style: {
                background: "#e8fdf2",
                color: "#14532d",
                borderLeft: "6px solid #16a34a",
              },
            },
            error: {
              iconTheme: {
                primary: "#dc2626",
                secondary: "#fff",
              },
              style: {
                background: "#ffe4e6",
                color: "#7f1d1d",
                borderLeft: "6px solid #dc2626",
              },
            },
          }}
        />
      </Provider>
    </HelmetProvider>
  </StrictMode>
);
