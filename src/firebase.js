import { v4 as uuidv4 } from "uuid";
import {
  onValue,
  onChildAdded,
  orderByChild,
  orderByValue,
  orderByKey,
  query,
  ref,
  remove,
  set,
  get,
} from "firebase/database";
import { getDatabase } from "firebase/database";
import {getStorage} from "firebase/storage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage();

export function getAllMessagesRef(...constraints) {
  return query(ref(database, "messages"), ...constraints);
}

export function deleteUser(id) {
  return remove(ref(database, `users/${id}`));
}

export function createMessageLog(info) {
  return set(ref(database, `messages/${uuidv4()}`), info);
}

export function createMessagesListener(callback = () => null) {
  return onValue(getAllMessagesRef(orderByChild("timestamp")), callback); 
}
