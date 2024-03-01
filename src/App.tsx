import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { initializeFirebaseApp } from "./firebase";
import { addToken, getDBToken, deleteToken } from "./lib/db";
import SubscribeUnSubscribeActions from "./components/SubscribeUnSubscribeActions";
import Loader from "./components/Loader";
import {
  FirebaseStatusT,
  MethodT,
  Topics,
  NotificationStateT,
} from "./sharedTypes";

import PrintFirebaseNotification from "./components/PrintFirebaseNotification";
import { getTopics } from "./apis";

const broadcastChannel = new BroadcastChannel("background-message-channel");
const firebaseServerKey = import.meta.env.REACT_APP_FIREBASE_SERVER_KEY;

function App() {
  const [method, setMethod] = useState<MethodT>("Subscribe");
  const [search, setSearch] = useState("");
  const [notificationModal, setNotificationModal] =
    useState<NotificationStateT>({
      showModal: false,
      data: null,
    });

  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseStatusT>({
    status: "pending",
    token: null,
  });

  const topicsQuery = useQuery({
    queryKey: ["topics"],
    enabled: !!firebaseStatus.token && !!firebaseServerKey,
    queryFn: () => getTopics(firebaseStatus.token ?? ""),
  });

  const showMessages = (payload: MessageEvent) => {
    console.log("firebase foreground message", payload.data);
    setNotificationModal({
      showModal: true,
      data: payload?.data,
    });
  };

  const handleUpdateToken = async () => {
    await deleteToken(firebaseStatus.token ?? "");
    window.location.reload();
  };

  const firebaseInitialize = async () => {
    const cachedToken = await getDBToken();

    if (cachedToken) {
      setFirebaseStatus({
        status: "success",
        token: cachedToken,
      });

      return;
    }

    initializeFirebaseApp((t) => {
      setFirebaseStatus({
        status: t.token ? "success" : "rejected",
        token: t.token,
        errorMessage: t.errorMessage,
      });

      if (t.token) addToken(t.token);
    });
  };

  const checkFirebaseAvailability = async () => {
    if (!("Notification" in window)) {
      return {
        token: null,
        status: "rejected",
        errorMessage: "Your browser doesn't support Notification",
      } as FirebaseStatusT;
    }

    if ("Notification" in window) {
      const notificationPermission = await Notification.requestPermission();
      if (!import.meta.env.REACT_APP_FIREBASE_API_KEY) {
        return {
          token: null,
          status: "rejected",
          errorMessage: "Firebase config is missing in .env file",
        } as FirebaseStatusT;
      }

      if (notificationPermission !== "granted") {
        return {
          token: null,
          status: "rejected",
          errorMessage: "Notification not granted, Please Enable it",
        } as FirebaseStatusT;
      }

      return;
    }
  };

  const getFilteredTopics = (): Topics => {
    const topics = topicsQuery.data ?? {};
    if (!search.trim()) return topics;
    let newTopics: Topics = {};

    Object.keys(topics ?? {}).forEach((topicKey) => {
      if (topicKey.includes(search)) {
        newTopics = {
          ...newTopics,
          [topicKey]: topics[topicKey],
        };
      }
    });

    return newTopics;
  };

  useEffect(() => {
    (async () => {
      const getAvailability = await checkFirebaseAvailability();

      if (getAvailability) {
        // not able to show notification
        setFirebaseStatus(getAvailability);
        return;
      }

      firebaseInitialize();

      navigator.serviceWorker?.addEventListener("message", showMessages);
      broadcastChannel.addEventListener("message", (event) => {
        if (event.data && event.data.type === "FORWARD_BACKGROUND_MESSAGE") {
          showMessages(event);
        }
      });
    })();

    return () => {
      broadcastChannel.removeEventListener("message", showMessages);
      navigator.serviceWorker?.removeEventListener("message", showMessages);
    };
  }, []);

  const filteredTopics = getFilteredTopics();

  return (
    <>
      <PrintFirebaseNotification
        notificationModal={notificationModal}
        onClose={() =>
          setNotificationModal({
            showModal: false,
            data: notificationModal.data,
          })
        }
      />

      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col gap-7 w-[500px] bg-[#f1faee] h-fit rounded-lg justify-center items-center  p-4">
          <h1 className="text-center text-xl">Test Firebase messages</h1>
          {firebaseStatus.status === "pending" ? (
            <Loader />
          ) : (
            <>
              <button onClick={handleUpdateToken} className="btn">
                Update Token
              </button>

              {!!notificationModal.data && (
                <button
                  onClick={() =>
                    setNotificationModal({
                      showModal: true,
                      data: notificationModal.data,
                    })
                  }
                  className="btn"
                >
                  Show Recent Notification
                </button>
              )}

              {(firebaseStatus.status === "rejected" || !firebaseServerKey) && (
                <h1 className="text-center text-xl text-red-500">
                  {firebaseStatus?.errorMessage ||
                    "Missing Server Key. You will be able to get Notification messages only"}
                </h1>
              )}

              {!!firebaseStatus.token && !!firebaseServerKey && (
                <>
                  <SubscribeUnSubscribeActions
                    method={method}
                    token={firebaseStatus.token}
                    setMethod={setMethod}
                  />

                  <input
                    className="input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search on Topics"
                  />

                  {topicsQuery.isPending || topicsQuery.isRefetching ? (
                    "loading..."
                  ) : (
                    <div className="max-h-[300px] w-full overflow-scroll flex flex-col items-center">
                      {Object.keys(filteredTopics ?? {}).map((key) => {
                        return (
                          <div
                            key={key}
                            className="bg-neutral-300 w-full text-center py-2 px-4 mb-2 rounded"
                          >
                            {key}
                          </div>
                        );
                      })}

                      {!Object.keys(filteredTopics ?? {}).length && (
                        <div className="text-center">No Data</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
