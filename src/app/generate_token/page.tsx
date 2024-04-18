"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import TickIcon from "@/assets/icons/tick.svg";
import CloseIcon from "@/assets/icons/close.svg";
import { Button } from "@/components/atoms/Button";
import { initializeFirebaseApp } from "@/firebase";
import { confirmationStore } from "@/store/firebase";
import useFirebaseCacheToken from "@/hooks/useFirebaseCacheToken";
import useFirebaseAvailability from "@/hooks/useFirebaseAvailability";

const Page = () => {
  const router = useRouter();
  const { onUpdateToken } = confirmationStore((store) => store);
  const { setToken } = useFirebaseCacheToken();
  const { isFirebaseAllowed, firebaseStatus } = useFirebaseAvailability();
  const [isInitializePending, setIsInitializePending] = useState(false);

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
          disabled={!isFirebaseAllowed || isInitializePending}
          onClick={generateFirebaseToken}
        />
      </div>
    </div>
  );
};

export default Page;
