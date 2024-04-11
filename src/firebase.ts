import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import toast from "react-hot-toast";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const initializeFirebaseApp = (
  getFirebaseToken: (token: string | null) => void
) => {
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  getToken(messaging, {
    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
  })
    .then((token) => {
      if (token) {
        getFirebaseToken(token);
      } else {
        const error = "No registration token available";
        toast.error(error);
        console.error(error);
      }
    })
    .catch((err) => {
      getFirebaseToken(null);
      const error = `An error occurred while retrieving token. ${err}`;
      console.error(error);
      toast.error(error);
    });
};
