// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCczisxSfdXKEVZ_qN5l-wFTL5LNpkR-vU",
  authDomain: "fir-e044c.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL:
    "https://fir-e044c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-e044c",
  storageBucket: "fir-e044c.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
