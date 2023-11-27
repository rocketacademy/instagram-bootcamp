// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  // apiKey: "AIzaSyA-OgWcImTfZWLhP2oVahMZlsg7ZyC6HCU",
  // authDomain: "rocketgram-6f5a2.firebaseapp.com",
  // databaseURL:
  //   "https://rocketgram-6f5a2-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "rocketgram-6f5a2",
  // storageBucket: "rocketgram-6f5a2.appspot.com",
  // messagingSenderId: "210992876137",
  // appId: "1:210992876137:web:ae55576f7c0e854d9c30f8",
};

console.log(firebaseConfig);

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
