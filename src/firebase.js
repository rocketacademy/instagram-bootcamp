// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,

  authDomain: process.env.AUTH_DOMAIN,

  databaseURL:
    'https://testing-bd9e4-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: process.env.PROJECT_ID,

  storageBucket: process.env.STORAGE_BUCKET,

  messagingSenderId: process.env.MESSAGING_SENDER_ID,

  appId: process.env.APP_ID,

  measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
