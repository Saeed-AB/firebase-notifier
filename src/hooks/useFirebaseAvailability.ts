import { useEffect, useState } from "react";

type FirebaseStatusT = { type: "success" | "error"; message: string };

const useFirebaseAvailability = () => {
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseStatusT[]>([]);

  const isFirebaseAllowed = !firebaseStatus.find(
    (item) => item.type === "error"
  );

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

  useEffect(() => {
    (async () => {
      const status = await getFirebaseStatus();
      setFirebaseStatus(status);
    })();
  }, []);

  return {
    isFirebaseAllowed,
    firebaseStatus,
  };
};

export default useFirebaseAvailability;
