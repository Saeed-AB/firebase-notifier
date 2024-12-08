"use client";
import { Fragment, useEffect, useState } from "react";
import CopyAndReGenerate from "./components/CopyAndReGenerate";
import PrintFirebaseNotification from "./components/PrintFirebaseNotification";
import SubscribeUnSubscribeActions from "./components/SubscribeUnSubscribeActions";
import TopicsList from "./components/TopicsList";
import { FiltersStateT } from "@/sharedTypes";
import { confirmationStore } from "@/store/firebase";
import useFirebaseCacheToken from "@/hooks/useFirebaseCacheToken";
import { useRouter } from "next/navigation";
import useFirebaseAvailability from "@/hooks/useFirebaseAvailability";
import { Button } from "@/components/atoms/Button";
import useGetAuth2Token from "@/hooks/useGetAuth2Token";

const broadcastChannel = new BroadcastChannel("background-message-channel");

function Home() {
  const router = useRouter();

  const {
    onUpdateToken,
    onShowNotificationModal,
    onUpdateLastNotificationMessage,
  } = confirmationStore((store) => store);

  const { getToken, getAuth2Token } = useFirebaseCacheToken();
  const { getAuth, isAuth2Initializing } = useGetAuth2Token({
    callback: () => window.location.reload(),
  });

  const isAuthInitialized = getAuth2Token();
  const { isFirebaseAllowed } = useFirebaseAvailability();

  const [filters, setFilters] = useState<FiltersStateT>({
    search: "",
  });

  const showMessages = (payload: MessageEvent) => {
    console.log("firebase foreground message", payload.data);
    onShowNotificationModal(true);
    onUpdateLastNotificationMessage(payload?.data);
  };

  const handleUpdateFilters = <Key extends keyof FiltersStateT>(
    key: Key,
    value: FiltersStateT[Key]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const cachedToken = getToken();

    if (cachedToken && isFirebaseAllowed) {
      onUpdateToken(cachedToken);
      navigator.serviceWorker?.addEventListener("message", showMessages);
      broadcastChannel.addEventListener("message", (event) => {
        if (event.data && event.data.type === "FORWARD_BACKGROUND_MESSAGE") {
          showMessages(event);
        }
      });
      return;
    }

    router.push("/generate_token");

    return () => {
      broadcastChannel.removeEventListener("message", showMessages);
      navigator.serviceWorker?.removeEventListener("message", showMessages);
    };
  }, [isFirebaseAllowed]);

  return (
    <Fragment>
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col gap-7 w-[500px] bg-[#f1faee] h-fit rounded-lg justify-center items-center  p-4">
          <h1 className="text-center text-xl">Firebase Notifier</h1>
          <CopyAndReGenerate />
          <PrintFirebaseNotification />

          <Button
            label="Refresh Auth 2 Token"
            onClick={getAuth}
            disabled={isAuth2Initializing}
          />

          {isAuthInitialized ? (
            <>
              <SubscribeUnSubscribeActions />

              <input
                className="input"
                value={filters.search}
                onChange={(e) => handleUpdateFilters("search", e.target.value)}
                placeholder="Search on Topics"
              />

              <TopicsList search={filters.search} />
            </>
          ) : (
            <h1 className="text-center text-xl">
              Note: Service Account File required for manage topic
            </h1>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
