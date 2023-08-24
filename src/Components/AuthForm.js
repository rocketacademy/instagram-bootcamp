import React, { useState } from "react";
import "./AuthForm.css";
import Button from "react-bootstrap/Button";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthForm({ toggleAuthForm }) {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "emailInputValue") {
      setEmailInputValue(value);
    } else if (name === "passwordInputValue") {
      setPasswordInputValue(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      setEmailInputValue("");
      setPasswordInputValue("");
      setIsNewUser(true);
      setErrorCode("");
      setErrorMessage("");
      toggleAuthForm();
    };

    const setErrorState = (error) => {
      setErrorCode(error.code);
      setErrorMessage(error.message);
    };

    if (isNewUser) {
      createUserWithEmailAndPassword(auth, emailInputValue, passwordInputValue)
        .then(closeAuthForm)
        .catch(setErrorState);
    } else {
      signInWithEmailAndPassword(auth, emailInputValue, passwordInputValue)
        .then(closeAuthForm)
        .catch(setErrorState);
    }
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser((prevIsNewUser) => !prevIsNewUser);
  };

  return (
    <div className="auth-div">
      <form onSubmit={handleSubmit} className="auth-form">
        <p>Sign in to Post Contents</p>
        <br />
        <div className="input-container">
          <label>
            Email:
            <input
              type="email"
              name="emailInputValue"
              value={emailInputValue}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="passwordInputValue"
              value={passwordInputValue}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <br />
        <br />
        <input
          type="submit"
          value={isNewUser ? "Create Account" : "Sign In"}
          disabled={!emailInputValue || !passwordInputValue}
          className="auth-buttons"
        />
        <br />
        <Button
          variant="link"
          onClick={toggleNewOrReturningAuth}
          className="auth-buttons"
        >
          {isNewUser
            ? "If you have an account, click here to login"
            : "If you are a new user, create an account here"}
        </Button>
      </form>
      <br />
      <p className="error-msg">
        {errorCode ? `Error code:\n${errorCode}` : null}
      </p>
      <p className="error-msg">
        {errorMessage ? `Error message:\n${errorMessage}` : null}
      </p>
    </div>
  );
}
