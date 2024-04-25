import { useEffect, useState } from "react";

export type FirebaseStatusT = "success" | 'warning' | "error"
type FirebaseItemT = { type: FirebaseStatusT; message: string };

const useFirebaseAvailability = () => {
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseItemT[]>([]);

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
        type: notificationPermission === "granted" ? "success" : "error",
        message: "Notification permission granted",
      },
      {
        type: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "success" : "error",
        message: "Firebase API_KEY",
      },
      {
        type: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ? "success" : "error",
        message: "Firebase VAPID_KEY",
      },
      {
        type: process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY ? "success" : "warning",
        message: "Firebase SERVER_KEY",
      },
    ] as FirebaseItemT[];
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
