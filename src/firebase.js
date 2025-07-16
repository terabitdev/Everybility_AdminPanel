// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0E51VYPeEtxgxbqmjsgHXekaHjLKWg2s",
  authDomain: "everybilityapp.firebaseapp.com",
  projectId: "everybilityapp",
  storageBucket: "everybilityapp.firebasestorage.app",
  messagingSenderId: "145406492812",
  appId: "1:145406492812:web:0408cd1976ff3d3d2bbba9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
console.log('Firebase Auth initialized:', auth);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);
console.log('Firestore initialized:', db);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);
console.log('Storage initialized:', storage);

export default app;