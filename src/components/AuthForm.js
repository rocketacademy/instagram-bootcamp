import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    if (e.target.name === "emailInputValue") {
      setEmailInputValue(e.target.value);
    } else if (e.target.name === "passwordInputValue") {
      setPasswordInputValue(e.target.value);
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
      navigate("/");
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
    setIsNewUser(!isNewUser);
  };

  return (
    <div>
      <p>{errorCode ? `Error code: ${errorCode}` : null}</p>
      <p>{errorMessage ? `Error message: ${errorMessage}` : null}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="emailInputValue"
            value={emailInputValue}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="passwordInputValue"
            value={passwordInputValue}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <input
          type="submit"
          value={isNewUser ? "Create Account" : "Sign In"}
          disabled={!emailInputValue || !passwordInputValue}
        />
        <input
          type="button"
          onClick={toggleNewOrReturningAuth}
          value={
            isNewUser
              ? "If you have an account, click here to login"
              : "If you are a new user, click here to create account"
          }
        />
      </form>
    </div>
  );
};

export default AuthForm;
