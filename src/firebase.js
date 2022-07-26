// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZ8IigSW19YYPYcI8rsxyRlLkRePh5cQY",
  authDomain: "rocketgram-katsusandwich.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL:
    "https://rocketgram-katsusandwich-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "rocketgram-katsusandwich",
  storageBucket: "rocketgram-katsusandwich.appspot.com",
  messagingSenderId: "658688300757",
  appId: "1:658688300757:web:2832062bc4f3e33aa5f45c",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
