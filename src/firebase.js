// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "rocketgram-31363.firebaseapp.com",
  projectId: "rocketgram-31363",
  storageBucket: "rocketgram-31363.appspot.com",
  messagingSenderId: "363838367492",
  appId: "1:363838367492:web:dac2bd08c5555fd31b5251",
  databaseURL: process.env.REACT_APP_DATABASE_URl,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
