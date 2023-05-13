import React, { useState, useEffect, useContext, createContext } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth } from "./firebase";

// Create auth context
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Listen for user auth state changes
  useEffect(() => {
    const currentUser = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      console.log(authUser);
    });
    return currentUser;
  }, []);

  // Register new user
  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Login existing user
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout user
  function logout() {
    return signOut(auth);
  }

  // Update email
  function updateUserEmail(email) {
    return updateEmail(user, email);
  }

  // Update password
  function updateUserPassword(password) {
    return updatePassword(user, password);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUserEmail,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
