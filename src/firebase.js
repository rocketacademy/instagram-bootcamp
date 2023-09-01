// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

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

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   // The value of `databaseURL` depends on the location of the database
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDFGBNICgeDmg5q6I5dusGDOxvoOrWfu-4",
  authDomain: "rocketgram-e0ba0.firebaseapp.com",
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://rocketgram-e0ba0-default-rtdb.firebasedatabase.app/",
  projectId: "rocketgram-e0ba0",
  storageBucket: "rocketgram-e0ba0.appspot.com",
  messagingSenderId: "293446546026",
  appId: "1:293446546026:web:6c8382c81b1153835a1013",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const database = getDatabase(firebaseApp);

export const realTimeDatabase = getDatabase(firebaseApp);
//export const storage = getStorage(firebaseApp);
//export const auth = getAuth(firebaseApp);
