import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import ErrorBoundary from "./ErrorBoundaries/ErrorBoundary.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <StrictMode>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
    </StrictMode>
  </ErrorBoundary>
);
