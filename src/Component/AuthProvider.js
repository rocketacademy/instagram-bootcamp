import { useState, useEffect } from "react";
import { auth } from "../firebase"; // Assuming you have already imported the initialized Firebase Auth instance as `auth`.
import AuthContext from "./AuthContext";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Log out successful, perform any additional actions if needed
      })
      .catch((error) => {
        // Handle any errors that occur during sign out
      });
  };

  return (
    <AuthContext.Provider value={{ user, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
