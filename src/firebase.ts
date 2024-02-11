import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

export const initializeFirebaseApp = () => {
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  getToken(messaging, { vapidKey: import.meta.env.REACT_APP_FIREBASE_VAPID_KEY }).then((currentToken) => {
    if (currentToken) {
      console.log('Token', currentToken)
      // ...
    } else {
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
  
}
