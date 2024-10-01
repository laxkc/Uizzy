import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { QuizProvider } from "./context/QuizProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QuizProvider>
        <App />
      </QuizProvider>
    </AuthProvider>
  </StrictMode>
);
