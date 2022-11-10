// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3fV-c_xpzaxE0VqfiahNd-znr9UMiets",
  authDomain: "instagram-5c518.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL:
    "https://instagram-5c518-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "PROJECT_ID",
  storageBucket: "instagram-5c518.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(firebaseApp);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);

export const storage = getStorage(firebaseApp);
