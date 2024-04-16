"use client";
import React, { useEffect, useState } from "react";

import TickIcon from "@/assets/icons/tick.svg";
import CloseIcon from "@/assets/icons/close.svg";
import { Button } from "@/components/atoms/Button";
import { initializeFirebaseApp } from "@/firebase";
import { confirmationStore } from "@/store/firebase";
import { useRouter } from "next/navigation";
import useFirebaseCacheToken from "@/hooks/useFirebaseCacheToken";

type FirebaseStatusT = { type: "success" | "error"; message: string };

const Page = () => {
  const router = useRouter();
  const { onUpdateToken } = confirmationStore((store) => store);
  const { setToken } = useFirebaseCacheToken();
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseStatusT[]>([]);
  const [isInitializePending, setIsInitializePending] = useState(false);

  const getFirebaseStatus = async () => {
    const notificationPermission = await Notification.requestPermission();

    return [
      {
        type: "Notification" in window ? "success" : "error",
        message: "Browser support Notification",
      },
      {
        type: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "success" : "error",
        message: "Firebase API_KEY",
      },
      {
        type: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? "success" : "error",
        message: "VAPID_KEY API_KEY",
      },
      {
        type: notificationPermission === "granted" ? "success" : "error",
        message: "Notification permission granted",
      },
    ] as FirebaseStatusT[];
  };

  const generateFirebaseToken = async () => {
    setIsInitializePending(true);

    initializeFirebaseApp((token) => {
      setIsInitializePending(false);
      if (token) {
        setToken(token);
        onUpdateToken(token);
        router.push("/");
      }
    });
  };

  useEffect(() => {
    (async () => {
      const status = await getFirebaseStatus();
      setFirebaseStatus(status);
    })();
  }, []);

  const isNotAbleToGenerateToken = !!firebaseStatus.find(
    (item) => item.type === "error"
  );

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col gap-7 w-[500px] bg-[#f1faee] h-fit rounded-lg justify-center items-center  p-4">
        <div className="w-full flex flex-col gap-2">
          {firebaseStatus.map((item, index) => (
            <div
              key={index}
              className="bg-neutral-300 w-full py-2 px-4 flex gap-2 items-center"
            >
              {item.type === "success" ? <TickIcon /> : <CloseIcon />}
              <p>{item.message}</p>
            </div>
          ))}
        </div>
        <Button
          label="Generate Token"
          disabled={isNotAbleToGenerateToken || isInitializePending}
          onClick={generateFirebaseToken}
        />
      </div>
    </div>
  );
};

export default Page;
