# Test Firebase messages

Notes: 
1) All Process happen on server side
2) Server key required for get topics, subscribe and unsubscribe

## Config firebase
1) Enable notification on the browser
2) Create .env file on app root then add firebase keys like this:

```env
REACT_APP_SERVER_URL="http://localhost:3000"

REACT_APP_FIREBASE_API_KEY="API Key"
REACT_APP_FIREBASE_AUTH_DOMAIN="AUTH Domain"
REACT_APP_FIREBASE_PROJECT_ID="Project Id"
REACT_APP_FIREBASE_STORAGE_BUCKET="Storage Bucket"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="Message Sender ID"
REACT_APP_FIREBASE_APP_ID="App Id"
REACT_APP_FIREBASE_VAPID_KEY="VAPID Key"
REACT_APP_FIREBASE_DATABASE_URL="Database Url"
REACT_APP_FIREBASE_MEASUREMENT_ID="Measurement ID"
REACT_APP_FIREBASE_SERVER_KEY="Server Key"
```

3) run the app server & client using these commands ```yarn dev``` & ```yarn dev:server```
4) After app running use can copy your token by click copy token button
5) you can then use your token to receive messages, subscribe and unsubscribe  to topics
6) while receiving notification popup will show with the data and it will print on console 
