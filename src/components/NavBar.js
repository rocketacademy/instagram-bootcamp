import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { UserContext } from "../App";

const NavBar = () => {
  const navigate = useNavigate();
  const { isUserLoggedIn, user, setUser, setIsUserLoggedIn, setMsg, msg } =
    useContext(UserContext);

  const toggleLogout = (
    <>
      <button
        onClick={() => {
          setUser({});
          setIsUserLoggedIn(false);
          setMsg("You have signed out successfully!");
          signOut(auth);
          navigate("/");
        }}
      >
        Log out
      </button>
    </>
  );

  return (
    <>
      <nav class="nav-bar">
        <div class="nav-bar-contents">
          <p>
            {!isUserLoggedIn
              ? `You are  not logged in.`
              : `You are logged in as, ${user.displayName}.`}
          </p>
          <p>{msg}</p>
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
