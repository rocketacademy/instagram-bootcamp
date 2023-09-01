// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFGBNICgeDmg5q6I5dusGDOxvoOrWfu-4",
  authDomain: "rocketgram-e0ba0.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://DATABASE_NAME.REGION.firebasedatabase.app",
  projectId: "rocketgram-e0ba0",
  storageBucket: "rocketgram-e0ba0.appspot.com",
  messagingSenderId: "293446546026",
  appId: "1:293446546026:web:6c8382c81b1153835a1013",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
