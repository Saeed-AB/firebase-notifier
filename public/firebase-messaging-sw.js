/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js')

self.addEventListener('fetch', () => {
  const urlParams = new URLSearchParams(location.search)
  self.firebaseConfig = Object.fromEntries(urlParams)
})

// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
}

const broadcastChannel = new BroadcastChannel('background-message-channel');

const showOSNotification = (payload) => {
  console.log('firebase background notification', payload)

  broadcastChannel.postMessage({
    type: 'FORWARD_BACKGROUND_MESSAGE',
    payload: payload,
  });
}

const isFirebaseSupported = () =>
  new Promise((resolve) => {
    if (
      !firebase ||
      !firebase.messaging ||
      !firebase.messaging.isSupported ||
      typeof firebase.messaging.isSupported !== 'function'
    )
      resolve(false)
    else resolve(firebase.messaging.isSupported())
  })

isFirebaseSupported().then((isSupported) => {
  if (!isSupported) return
  firebase.initializeApp(self.firebaseConfig || defaultConfig)
  const messaging = firebase.messaging()
  messaging.onBackgroundMessage(showOSNotification)
})
