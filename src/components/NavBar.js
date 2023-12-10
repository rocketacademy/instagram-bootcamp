import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const NavBar = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  //on first page loads, determine if user is logged in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) return setIsUserLoggedIn(true);
      return setIsUserLoggedIn(false);
    });
  }, []);

  const toggleLogout = (
    <>
      <button
        onClick={() => {
          navigate("/");
          signOut(auth);
        }}
      >
        Log out
      </button>
    </>
  );

  return (
    <>
      <nav class="dark:bg-gray-900 text-white">
        <div class="flex justify-between mx-auto p-5 max-w-screen-xl">
          <p>
            {!isUserLoggedIn
              ? `You are  not logged in.`
              : `You are logged in as, ${auth.currentUser.displayName}.`}
          </p>
          {!isUserLoggedIn ? (
            <Link to="/authform"> Log In / Sign Up</Link>
          ) : (
            toggleLogout
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
