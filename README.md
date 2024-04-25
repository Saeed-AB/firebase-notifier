# Test Firebase messages

Notes: 
1) All Process happen on server side
2) Server key required for get topics, subscribe and unsubscribe

## Config firebase
1) Enable notification on the browser
2) Create .env file on app root then add firebase keys like this:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="API Key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="AUTH Domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="Project Id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="Storage Bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="Message Sender ID"
NEXT_PUBLIC_FIREBASE_APP_ID="App Id"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="VAPID Key"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="Database Url"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="Measurement ID"
NEXT_PUBLIC_FIREBASE_SERVER_KEY="Server Key"
```

3) run the server using this command ```yarn dev```
4) use generate token button to initialize firebase
4) After the initializing you can copy your token by click the copy token button
5) you can then use your token to receive messages, subscribe and unsubscribe  to topics
6) while receiving notification popup will show with the data and it will print on console 
