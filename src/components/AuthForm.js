import React, { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { Alert, Button, Form } from "react-bootstrap";

export function AuthForm({ toggleAuthForm }) {
  const [form, setForm] = useState({
    emailInputValue: "",
    passwordInputValue: "",
  });

  const [isNewUser, setIsNewUser] = useState(true);
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      setForm({
        emailInputValue: "",
        passwordInputValue: "",
      });
      setIsNewUser(true);
      setErrorCode("");
      setErrorMessage("");

      toggleAuthForm();
    };

    const setErrorState = (error) => {
      setErrorCode(error.code);
      setErrorMessage(error.message);
    };

    //Authenticate user on submit
    if (isNewUser) {
      createUserWithEmailAndPassword(
        auth,
        form.emailInputValue,
        form.passwordInputValue
      )
        .then(closeAuthForm)
        .catch(setErrorState);
    } else {
      signInWithEmailAndPassword(
        auth,
        form.emailInputValue,
        form.passwordInputValue
      )
        .then(closeAuthForm)
        .catch(setErrorState);
    }
  };

  const toggleNewOrReturningAuth = () => {
    setIsNewUser(!isNewUser);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          {errorCode && (
            <Alert variant="danger">{`Error code: ${errorCode}`}</Alert>
          )}
        </Form.Group>

        <Form.Group>
          {errorMessage && (
            <Alert variant="danger">{`Error message: ${errorMessage}`}</Alert>
          )}
        </Form.Group>
        <p>Sign in with this form to post.</p>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="emailInputValue"
            value={form.emailInputValue}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="passwordInputValue"
            value={form.passwordInputValue}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button
          type="submit"
          className="w-100"
          // Disable form submission if email or password are empty
          disabled={!form.emailInputValue || !form.passwordInputValue}
        >
          {isNewUser ? "Create Account" : "Sign In"}
        </Button>

        <Button
          variant="link"
          className="w-100"
          onClick={toggleNewOrReturningAuth}
        >
          {isNewUser
            ? "If you have an account, click here to login"
            : "If you are a new user, click here to create account"}
        </Button>
      </Form>
    </div>
  );
}
