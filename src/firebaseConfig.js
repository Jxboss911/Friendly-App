// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  // Import Firebase Authentication
import { getFirestore } from "firebase/firestore"; 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwDRKv-1k365dztRH5Ootp0fNktJigeaw",
  authDomain: "friendly-app-1b9ac.firebaseapp.com",
  projectId: "friendly-app-1b9ac",
  storageBucket: "friendly-app-1b9ac.firebasestorage.app",
  messagingSenderId: "781181193956",
  appId: "1:781181193956:web:ff39a8960e66d06408a6f1",
  measurementId: "G-9PMN4PJP8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app);
const db = getFirestore(app);

// Export auth to be used in other files
export { auth, db };