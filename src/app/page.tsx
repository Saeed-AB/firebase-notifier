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

const broadcastChannel = new BroadcastChannel("background-message-channel");
const firebaseServerKey = process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY;

function Home() {
  const router = useRouter();

  const {
    onUpdateToken,
    onShowNotificationModal,
    onUpdateLastNotificationMessage,
  } = confirmationStore((store) => store);
  const { getToken } = useFirebaseCacheToken();
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
          {firebaseServerKey ? (
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
              Note: Server key Required to manage topics
            </h1>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
