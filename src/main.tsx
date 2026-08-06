import { StrictMode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRoute } from "./app/router/AppRoute";
import { queryClient } from "./shared/api/queryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRoute />
    </QueryClientProvider>
  </StrictMode>,
);
