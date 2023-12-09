import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";

const NavBar = ({ isUserLoggedIn, auth }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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
      <nav class="bg-gray-300 fixed w-full z-20 top-0 h-30">
        <div class="flex justify-between mx-auto p-5">
          <p>
            {!isUserLoggedIn
              ? `You are  not logged in.`
              : `You are logged in as, ${auth.currentUser.displayName}.`}
          </p>
          <div>
            {!isUserLoggedIn ? (
              <button onClick={() => setIsModalOpen(true)}>
                Log In / Sign Up
              </button>
            ) : (
              toggleLogout
            )}
          </div>
        </div>
      </nav>
      {isModalOpen && <AuthForm setIsModalOpen={setIsModalOpen} />}
    </>
  );
};

export default NavBar;
