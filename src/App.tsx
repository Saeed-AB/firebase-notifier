import { useEffect, useState } from "react";
import { initializeFirebaseApp } from "./firebase";
import { Stores, addData, deleteData, getStoreData, initDB } from "./lib/db";
import Actions from "./components/Actions";

type Topics = {
  [K: string]: { [K: string]: string };
};

export type MethodT = "Subscribe" | "UnSubscribe";

function App() {
  const [method, setMethod] = useState<MethodT>("Subscribe");
  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState<Topics>({});

  const showMessages = (payload: MessageEvent) => {
    console.log("firebase foreground message", payload);
  };

  const getTopics = async (t: string) => {
    const response = await fetch(
      `http://localhost:3000/get_topics?token=${t}`,
      {
        method: "GET",
      }
    );
    const topics = await response.json();
    setTopics(topics);
  };

  const handleSubscribeUnSubscribe = async (topic: string) => {
    return await fetch(`http://localhost:3000/topic_methods`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        method,
        topic,
      }),
    });
  };

  const handleResetToken = async () => {
    await deleteData(Stores.FirebaseData, token);
    window.location.reload();
  };

  const firebaseInitialize = async () => {
    await initDB();

    const data = await getStoreData<{ token: string }>(Stores.FirebaseData);
    const cachedToken = data?.[0]?.token ?? "";

    if (cachedToken) {
      setToken(cachedToken);
      return;
    }

    initializeFirebaseApp((t) => {
      setToken(t);
      addData(Stores.FirebaseData, { token: t });
    });
  };

  useEffect(() => {
    if (token) {
      getTopics(token);
    }
  }, [token]);

  useEffect(() => {
    firebaseInitialize();

    navigator.serviceWorker?.addEventListener("message", showMessages);

    return () => {
      navigator.serviceWorker?.removeEventListener("message", showMessages);
    };
  }, []);

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

  const filteredTopics = getFilteredTopics();

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col gap-7 w-[500px] bg-[#f1faee] h-fit rounded-lg justify-center items-center  p-4">
        <h1 className="text-center text-xl">Test Firebase messages</h1>
        <button onClick={handleResetToken} className="btn">
          Reset Token
        </button>

        {!!token && (
          <>
            <Actions
              method={method}
              setMethod={setMethod}
              handleSubscribeUnSubscribe={handleSubscribeUnSubscribe}
              getTopics={() => getTopics(token)}
            />

            <input
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search on Topics"
            />

            <div className="max-w-[500px] max-h-[300px] overflow-scroll flex flex-col items-center">
              {Object.keys(filteredTopics ?? {}).map((key) => {
                return (
                  <div
                    key={key}
                    className="bg-neutral-300 text-center py-2 px-4 mb-2 rounded"
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
      </div>
    </div>
  );
}

export default App;
