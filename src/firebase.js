// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZUS58FDXTgyBnw7lj9FhlNiz-_x6lwXQ",
  authDomain: "caleb-instagram-7db30.firebaseapp.com",
  databaseURL:
    "https://caleb-instagram-7db30-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "caleb-instagram-7db30",
  storageBucket: "caleb-instagram-7db30.appspot.com",
  messagingSenderId: "241996060780",
  appId: "1:241996060780:web:ced11e38d63d57800aa049",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
export const auth = getAuth(firebaseApp);
