import { useEffect, useState } from "react";
import { initializeFirebaseApp } from "./firebase";
import { addData, deleteData, getTokenFromDb, initDB } from "./lib/db";
import SubscribeUnSubscribeActions from "./components/SubscribeUnSubscribeActions";
import Loader from "./components/Loader";
import { FirebaseStatusT, MethodT, Topics, Stores } from "./sharedTypes";
import toast, { Toaster } from "react-hot-toast";
import Modal from "./components/Modal";

const serverEndpoint = "http://localhost:3000";

export const handleToast = (statusCode: number, message: string) => {
  if (!message) return;

  if (statusCode === 200) {
    toast.success(message);
  } else {
    toast.error(message);
  }
};


function App() {
  const [method, setMethod] = useState<MethodT>("Subscribe");
  const [search, setSearch] = useState("");
  const [notificationModal, setNotificationModal] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [topics, setTopics] = useState<Topics>({});
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseStatusT>({
    status: "pending",
    token: null,
  });

  const showMessages = (payload: MessageEvent) => {
    console.log("firebase foreground message", payload.data);
    setNotificationModal(payload?.data ?? {});
  };

  const getTopics = async (t: string) => {
    const response = await fetch(`${serverEndpoint}/get_topics?token=${t}`, {
      method: "GET",
    });

    const topics = await response.json();
    setTopics(topics);
  };

  const handleSubscribeUnSubscribe = async (topic: string) => {
    return await fetch(`${serverEndpoint}/topic_methods`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: firebaseStatus.token,
        method,
        topic,
      }),
    });
  };

  const handleUpdateToken = async () => {
    await deleteData(Stores.FirebaseData, firebaseStatus.token ?? "");
    window.location.reload();
  };

  const firebaseInitialize = async () => {
    await initDB();

    const cachedToken = await getTokenFromDb();

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

      addData(Stores.FirebaseData, { token: t });
    });
  };

  const checkFirebaseAvailability = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((notification) => {
        if (!import.meta.env.REACT_APP_FIREBASE_API_KEY) {
          setFirebaseStatus({
            token: null,
            status: "rejected",
            errorMessage: "Firebase config is missing in .env file",
          });
        } else if (notification === "granted") {
          firebaseInitialize();
          navigator.serviceWorker?.addEventListener("message", showMessages);
        } else {
          setFirebaseStatus({
            token: null,
            status: "rejected",
            errorMessage: "Notification not granted, Please Enable it",
          });
        }
      });
    } else {
      setFirebaseStatus({
        token: null,
        status: "rejected",
        errorMessage: "Your browser doesn't support Notification",
      });
    }
  };

  const getFilteredTopics = (): Topics => {
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
    if (firebaseStatus.token) {
      getTopics(firebaseStatus.token);
    }
  }, [firebaseStatus.token]);

  useEffect(() => {
    checkFirebaseAvailability();
    return () => {
      navigator.serviceWorker?.removeEventListener("message", showMessages);
    };
  }, []);

  const filteredTopics = getFilteredTopics();

  return (
    <>
      <Toaster />
      {notificationModal && (
        <Modal onClose={() => setNotificationModal(null)}>
          <div className="w-full max-w-[800px]">
            <pre className="overflow-scroll">
              {JSON.stringify(notificationModal, null, 2)}
            </pre>
          </div>
        </Modal>
      )}

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

              {firebaseStatus.status === "rejected" && (
                <h1 className="text-center text-xl text-red-500">
                  {firebaseStatus.errorMessage}
                </h1>
              )}

              {!!firebaseStatus.token && (
                <>
                  <SubscribeUnSubscribeActions
                    method={method}
                    setMethod={setMethod}
                    getTopics={() => getTopics(firebaseStatus.token ?? "")}
                    handleSubscribeUnSubscribe={handleSubscribeUnSubscribe}
                  />

                  <input
                    className="input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search on Topics"
                  />

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
