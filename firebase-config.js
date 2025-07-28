// firebase-config.js
// Firebase SDKs are loaded via CDN in HTML, so we just initialize here.

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVpddOtX1yRxslNxh8yz3SJq53eUYhkZ0",
  authDomain: "next-gen-186aa.firebaseapp.com",
  projectId: "next-gen-186aa",
  storageBucket: "next-gen-186aa.firebasestorage.app",
  messagingSenderId: "338569531164",
  appId: "1:338569531164:web:932df077b59a0a371b34d9",
  measurementId: "G-7GCT5KHFQ0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage(); // For file uploads if you add them later
