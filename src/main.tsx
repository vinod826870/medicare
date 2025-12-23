import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import ErrorBoundary from "./components/common/ErrorBoundary.tsx";

import { inject } from "@vercel/analytics";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Enable Vercel Analytics
inject();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppWrapper>
        <App />
        {/* Enable Vercel Speed Insights */}
        <SpeedInsights />
      </AppWrapper>
    </ErrorBoundary>
  </React.StrictMode>
);

