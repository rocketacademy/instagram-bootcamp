// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjU5Ml0DtWGnzi4e-6wGDDHGG9cIMSaXU",
  authDomain: "rocketgram-4b663.firebaseapp.com",
  databaseURL:
    "https://rocketgram-4b663-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "rocketgram-4b663",
  storageBucket: "rocketgram-4b663.appspot.com",
  messagingSenderId: "479359383313",
  appId: "1:479359383313:web:5141b5959e00049c67beb0",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
