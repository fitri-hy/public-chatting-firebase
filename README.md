# Anonymous Messaging - Next.js

This is an Anonymous Messaging project Integrated with Firebase and AI using [Next.js](https://nextjs.org) bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Firebase Setup

Go to `/app/lib/firebaseConfig.js` and adjust:

```javascript
const firebaseConfig = {
  apiKey: "AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxx-xxxxx.firebaseapp.com",
  databaseURL: "https://xxx-xxxx-default-rtdb.firebaseio.com",
  projectId: "xxx-xxxx",
  storageBucket: "xxx-xxxx.firebasestorage.app",
  messagingSenderId: "xxxxxxxxxxx",
  appId: "1:xxxxxxxxxx:web:xxxxxxxxxxx"
};
```

You can see the complete details at [Firebase Console](https://console.firebase.google.com/):

`Firebase Console -> Project Settings -> SDK setup and configuration -> Select Config`

## Lynix AI Setup

Go to `/app/lib/config.js` and adjust:

```
export const LYNIX_API_KEY = 'lynix-xxxxxxxxxxxxxxxxxxxxxxxx';
```

You can see the complete details at [**Lynix AI**](https://lynix.i-as.dev/docs#limits).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Don't forget to leave a star