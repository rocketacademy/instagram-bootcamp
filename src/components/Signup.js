import React, { useContext } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import useInput from "./hooks/useInput";

const Signup = () => {
  const [username, setNewUsername, resetUsername] = useInput("");
  const [email, setNewEmail, resetEmail] = useInput("");
  const [password, setNewPassword, resetPassword] = useInput("");

  const { setIsUserLoggedIn, setMsg } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!password || !email || !username) return;

    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!newUser) return;
      if (newUser) {
        //console.log(newUser); keeping this here instead of deleting for future reference

        updateProfile(auth.currentUser, {
          uid: newUser.user.uid,
          displayName: username,
          email: email,
        });

        setMsg("You have signed up successfully! Please sign in.");
        // setUser(newUser.user);
        setIsUserLoggedIn(false);
        resetUsername();
        resetPassword();
        resetEmail();
        navigate("/authform");
      }
    } catch (error) {
      setMsg(error.message);
    }
  };
  return (
    <>
      <p class="header">Create Account</p>
      <form onSubmit={handleSignUp}>
        <div>
          <input
            type="text"
            placeholder="Username"
            {...setNewUsername}
            name="username"
            class="input"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            {...setNewEmail}
            name="email"
            class="input"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            {...setNewPassword}
            name="password"
            class="input"
            autoComplete="password"
          />
        </div>
        <div>
          <button type="submit" class="btn">
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
};

export default Signup;
