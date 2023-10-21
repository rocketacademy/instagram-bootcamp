import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebase';

export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.log(
      `Error at registration:${Error(error.code)} ${Error(error.message)}`
    );
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.log(`Error at login:${Error(error.code)} ${Error(error.message)}`);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(
      `Error at signOut:${Error(error.code)} ${Error(error.message)}`
    );
  }
};

export const reAuth = (callback) => {
  onAuthStateChanged(auth, callback);
};
