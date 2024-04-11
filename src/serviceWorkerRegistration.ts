const firebaseConfig = new URLSearchParams({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ?? '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ?? '',
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL ?? '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID ?? '',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID ?? '',
}).toString()


export function register(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${window.location.origin}/firebase-messaging-sw.js?${firebaseConfig}`
      navigator.serviceWorker.register(swUrl).catch((e) => {
        console.error('Service worker registration failed:', e)
      })
    })
  }
}

export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}
