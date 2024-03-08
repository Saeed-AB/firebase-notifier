import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import App from "./App.tsx";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster toastOptions={{ className: "toaster-style" }} />
    </QueryClientProvider>
  </StrictMode>
);

serviceWorkerRegistration.register();
