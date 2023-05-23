// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwzx_52za3BM109NgVuJomKdrDF8Lnbrs",
  authDomain: "rocketgram-98b44.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL:
    "https://rocketgram-98b44-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "rocketgram-98b44",
  storageBucket: "rocketgram-98b44.appspot.com",
  messagingSenderId: "572134929616",
  appId: "1:572134929616:web:27f15b7e09e047a49e9ad5",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
