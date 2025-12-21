import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import ErrorBoundary from "./components/common/ErrorBoundary.tsx";
import { Analytics } from "@vercel/analytics/next";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppWrapper>
        <App />
        <Analytics />
      </AppWrapper>
    </ErrorBoundary>
  </React.StrictMode>
);
