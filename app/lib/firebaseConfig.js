import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxx-xxxxx.firebaseapp.com",
  databaseURL: "https://xxx-xxxx-default-rtdb.firebaseio.com",
  projectId: "xxx-xxxx",
  storageBucket: "xxx-xxxx.firebasestorage.app",
  messagingSenderId: "xxxxxxxxxxx",
  appId: "1:xxxxxxxxxx:web:xxxxxxxxxxx"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
