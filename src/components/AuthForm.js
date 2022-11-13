import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthForm = (props) => {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    switch (event.target.name) {
      case "emailInputValue":
        setEmailInputValue(event.target.value);
        break;
      default:
        setPasswordInputValue(event.target.value);
    }
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!emailInputValue || !passwordInputValue) return;

    // Authenticate user on submit
    if (isNewUser) {
      return createUserWithEmailAndPassword(
        auth,
        emailInputValue,
        passwordInputValue
      )
        .then(closeAuthForm)
        .catch(setErrorState);
    }

    return signInWithEmailAndPassword(auth, emailInputValue, passwordInputValue)
      .then(closeAuthForm)
      .catch(setErrorState);
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser(!isNewUser);
  };

  return (
    <div>
      {errorCode && <p>{`Error code: ${errorCode}`}</p>}
      {errorMessage && <p>{`Error message: ${errorMessage}`}</p>}
      <p>Sign in here - password is 8 characters minimum.</p>
      <form>
        <div>
          <label>Username: </label>
          <input
            type="text"
            name="emailInputValue"
            value={emailInputValue}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            name="passwordInputValue"
            minLength="8"
            required
            value={passwordInputValue}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Button onClick={handleSubmit}>
            {isNewUser ? "Create Account" : "Sign In"}
          </Button>
        </div>
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
