// Firebase Configuration & Initialization Module
// FindLoop Campus Lost-and-Found System

// Import Firebase SDKs via ESM CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Project Credentials Placeholder
export const firebaseConfig = {
  apiKey: "AIzaSyCkavATvJ6E-pob8R6Kh6bzPfMq_9167ZI",
  authDomain: "findloop-gehu.firebaseapp.com",
  projectId: "findloop-gehu",
  storageBucket: "findloop-gehu.firebasestorage.app",
  messagingSenderId: "991310250299",
  appId: "1:991310250299:web:d93b4d829098cdf6eaf71e",
  measurementId: "G-W03NS8SZD5"
};

// Initialize Firebase App
let app, auth, db;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🔥 Firebase initialized successfully.");
  } else {
    console.warn("⚠️ Firebase configuration keys not populated. Operating in local seed mode.");
  }
} catch (e) {
  console.warn("Firebase init note:", e);
}

export { app, auth, db };
