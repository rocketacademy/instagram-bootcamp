import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

import "../Login.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [registerEmail, setReginsterEmail] = useState("");
  const [registerPassword, setReginsterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Reginstration logic
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  // login logic
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLogin) {
      login();
    } else {
      register();
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <h2>Rocketgram</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email address"
            value={isLogin ? loginEmail : registerEmail}
            onChange={(e) =>
              isLogin
                ? setLoginEmail(e.target.value)
                : setReginsterEmail(e.target.value)
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={isLogin ? loginPassword : registerPassword}
            onChange={(e) =>
              isLogin
                ? setLoginPassword(e.target.value)
                : setReginsterPassword(e.target.value)
            }
          />
          <button type="submit">{isLogin ? "Log in" : "Sign up"}</button>
          <p className="message">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsLogin(!isLogin);
              }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Auth;
