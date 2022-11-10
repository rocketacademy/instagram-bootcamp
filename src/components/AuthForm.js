import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = (props) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailInputChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setPasswordInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const closeAuthForm = () => {
      setEmailInput("");
      setPasswordInput("");
      setIsNewUser(true);
      setErrorCode("");
      setErrorMessage("");
      props.toggleAuthForm();
    };

    const setErrorState = (error) => {
      setErrorCode({ ...errorCode, errorCode: error.code });
      setErrorMessage({ ...errorMessage, errorMessage: error.message });
    };

    if (isNewUser) {
      createUserWithEmailAndPassword(auth, emailInput, passwordInput)
        .then(closeAuthForm)
        .catch(setErrorState);
    } else {
      signInWithEmailAndPassword(auth, emailInput, passwordInput)
        .then(closeAuthForm)
        .catch(setErrorState);
    }
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser(false);
  };

  return (
    <div>
      <p>{errorCode ? `Error Code: ${errorCode}` : null}</p>
      <p>{errorMessage ? `Error Message: ${errorMessage}` : null}</p>
      <p>Sign in to post!</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Email: </span>
          <input
            type="email"
            name="emailInput"
            value={emailInput}
            onChange={handleEmailInputChange}
          />
        </label>
        <br />
        <label>
          <span>Password: </span>
          <input
            type="password"
            name="passwordInput"
            value={passwordInput}
            onChange={handlePasswordInputChange}
          />
        </label>
        <br />
        <input
          type="submit"
          value={isNewUser ? "Create Account" : "Sign In"}
          disabled={!emailInput || !passwordInput}
        />
        <br />
        <Button variant="link" onClick={toggleNewOrReturningAuth}>
          {isNewUser
            ? "If you have an account, click here to login"
            : "If you are a new user, click here to create account"}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;
