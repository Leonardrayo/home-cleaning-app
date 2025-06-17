// Firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYHIwb0pQfaoNN0n8SR6gfKkl09DoyM_Y",
  authDomain: "datsaficleaningsystem.firebaseapp.com",
  projectId: "datsaficleaningsystem",
  storageBucket: "datsaficleaningsystem.appspot.com",
  messagingSenderId: "1060342114892",
  appId: "1:1060342114892:web:9ce6b43c40c4f1678ce2e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export auth and db
export { auth, db };