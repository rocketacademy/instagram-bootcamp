// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
//This line is importing a specific function getStorage from the Firebase storage module.
//This function helps us access the storage service provided by Firebase, which is a way to store files and data securely.
import { getStorage } from "firebase/storage";
//This line imports a specific function called getAuth from the Firebase Authentication library, which is typically used to create an authentication instance.
import { getAuth } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  // The value of `databaseURL` depends on the location of the database
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
//getStorage(firebaseApp): This is a function call. It uses the getStorage function from the Firebase storage module.
//It takes an argument firebaseApp, which presumably represents a Firebase app instance.
//This line essentially initializes and configures the Firebase storage service for use in the application.
//In conclusion, This constant, named storage provides methods and functionality to interact with the Firebase storage, such as uploading and retrieving files securely.
export const storage = getStorage(firebaseApp);
//firebaseApp is assumed to be a previously configured Firebase app instance. It's important to set up Firebase in your application before using Firebase Authentication.
//getAuth(firebaseApp) calls the getAuth function with your Firebase app instance as an argument. This creates an authentication instance that is associated with your Firebase project.
export const auth = getAuth(firebaseApp);
