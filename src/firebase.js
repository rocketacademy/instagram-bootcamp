// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwEKAJD40A2djKKWYDCh70cFK_yiObFBw",
  authDomain: "rocketgram-93e0e.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL:
    "https://rocketgram-93e0e-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "rocketgram-93e0e",
  storageBucket: "rocketgram-93e0e.appspot.com",
  messagingSenderId: "1039029288217",
  appId: "1:1039029288217:web:8472b9725900564cb69988",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
