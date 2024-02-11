# Test Firebase messages

## Config firebase
1) Enable notification on the browser
2) Create .env file on app root then add firebase keys like this:

```env
REACT_APP_FIREBASE_API_KEY="API Key"
REACT_APP_FIREBASE_AUTH_DOMAIN="AUTH Domain"
REACT_APP_FIREBASE_PROJECT_ID="Project Id"
REACT_APP_FIREBASE_STORAGE_BUCKET="Storage Bucket"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="MEssage Sender ID"
REACT_APP_FIREBASE_APP_ID="App Id"
REACT_APP_FIREBASE_VAPID_KEY="VAPID Key"
REACT_APP_FIREBASE_DATABASE_URL="Database Url"
REACT_APP_FIREBASE_MEASUREMENT_ID="Measurement ID"
```

3) run the app using this command ```yarn dev```
4) After app running open the inspect on console tab and you will see your token
5) you can then use your token to receive messages/ subscribe to topics
6) once receive the notification it will show on the console
