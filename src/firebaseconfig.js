// src/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAYHIwb0pQfaoNN0n8SR6gfKkl09DoyM_Y",
  authDomain: "datsaficleaningsystem.firebaseapp.com",
  projectId: "datsaficleaningsystem",
  storageBucket: "datsaficleaningsystem.appspot.com",
  messagingSenderId: "1060342114892",
  appId: "1:1060342114892:web:9ce6b43c40c4f1678ce2e9"
};

// ✅ Prevent duplicate initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export default app;