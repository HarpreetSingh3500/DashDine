// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "dash-dine-food-services.firebaseapp.com",
  projectId: "dash-dine-food-services",
  storageBucket: "dash-dine-food-services.firebasestorage.app",
  messagingSenderId: "812563188477",
  appId: "1:812563188477:web:5794b11857b6d82a904c94",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
export {app,auth}