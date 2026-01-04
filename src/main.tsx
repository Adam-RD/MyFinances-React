import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import AuthProvider from "./app/providers/AuthProvider";
import BalanceProvider from "./app/providers/BalanceProvider";
import { CurrencyProvider } from "./app/providers/CurrencyContext";
import { ThemeProvider } from "./app/providers/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <BalanceProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </BalanceProvider>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  </React.StrictMode>
);
