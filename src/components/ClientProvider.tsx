"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
const queryClient = new QueryClient();
import { Toaster } from "react-hot-toast";
import * as serviceWorkerRegistration from "../serviceWorkerRegistration";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    serviceWorkerRegistration.register();

    return () => {
      serviceWorkerRegistration.unregister();
    };
  }, []);

  return (
    <Fragment>
      <Toaster toastOptions={{ className: "toaster-style" }} />

      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Fragment>
  );
}
