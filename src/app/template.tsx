"use client";
import { useState } from "react";
// import * as serviceWorkerRegistration from "../serviceWorkerRegistration";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export default function Template({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster toastOptions={{ className: "toaster-style" }} />
      {children}
    </QueryClientProvider>
  );
}

// serviceWorkerRegistration.register();
