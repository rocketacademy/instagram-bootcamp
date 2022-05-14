// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Replace Rocket's reference solution config with your app's Firebase project configuration
// const firebaseConfig = {
//   apiKey: "API_KEY",
//   authDomain: "PROJECT_ID.firebaseapp.com",
//   // The value of `databaseURL` depends on the location of the database
//   databaseURL: "https://DATABASE_NAME.REGION.firebasedatabase.app",
//   projectId: "PROJECT_ID",
//   storageBucket: "PROJECT_ID.appspot.com",
//   messagingSenderId: "SENDER_ID",
//   appId: "APP_ID",
// };
const firebaseConfig = {
  apiKey: "AIzaSyA9k-F40SzVpAWWSKpICi2tqbYJrJVqiho",
  authDomain: "instagram-5e863.firebaseapp.com",
  databaseURL:
    "https://instagram-5e863-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "instagram-5e863",
  storageBucket: "instagram-5e863.appspot.com",
  messagingSenderId: "1016013432700",
  appId: "1:1016013432700:web:9ecc9fe184c5786eb0e6f9",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);

// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage(firebaseApp);
