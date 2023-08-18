import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

//styling
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const AuthField = (props) => {
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const navigate = useNavigate();

  const handleInputChange = (event) => {
    if (event.target.name === "emailInputValue") {
      setEmailInputValue(event.target.value);
    } else if (event.target.name === "passwordInputValue") {
      setPasswordInputValue(event.target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      // Reset auth form state
      setEmailInputValue("");
      setPasswordInputValue("");
      setIsNewUser(true);
      setErrorCode("");
      setErrorMessage("");
    };

    const setErrorState = (error) => {
      setErrorCode(error.code);
      setErrorMessage(error.message);
    };

    // Authenticate user on submit
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
      <p>Sign in with this form to post.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3"></Form.Group>
        <div class="form-group">
          <label for="exampleFormControlInput1">Email address</label>
          <input
            type="email"
            class="form-control"
            name="emailInputValue"
            value={emailInputValue}
            onChange={handleInputChange}
            placeholder="name@example.com"
          />
        </div>
        <br />
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            class="form-control"
            placeholder="Password"
            name="passwordInputValue"
            value={passwordInputValue}
            onChange={handleInputChange}
          />
        </div>
        <br />
        <Button
          as="input"
          type="submit"
          value={isNewUser ? "Create Account" : "Sign In"}
          // Disable Send button when text input is empty
          disabled={!emailInputValue || !passwordInputValue}
          variant="primary"
        />
        <br />
        <Button variant="link" onClick={toggleNewOrReturningAuth}>
          {isNewUser ? "Returning? Click here to login" : "Create an account"}
        </Button>
      </Form>
    </div>
  );
};

export default AuthField;
