"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import * as serviceWorkerRegistration from "../serviceWorkerRegistration";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

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
