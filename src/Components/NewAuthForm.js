import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Form, Row } from "react-bootstrap";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewAuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const signUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setEmail("");
        setPassword("");
        navigate("/");
      })
      .catch((error) => {
        setErrorCode(error.code);
        setErrorMessage(error.message);
      });
  };
  const signIn = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setEmail("");
        setPassword("");
        navigate("/");
      })
      .catch((error) => {
        setErrorCode(error.code);
        setErrorMessage(error.message);
      });
  };

  return (
    <div>
      <Form>
        <Form.Group
          as={Row}
          className="mb-3 align-items-center"
          controlId="formPlaintextEmail"
        >
          <Form.Label column sm="4">
            Email
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3 align-items-center"
          controlId="formPlaintextPassword"
        >
          <Form.Label column sm="4">
            Password
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Col>
        </Form.Group>
      </Form>
      <div className="errorMessage">
        <p>{errorCode && `Error code: ${errorCode}`}</p>
        <p>{errorMessage && `Error message: ${errorMessage}`}</p>
      </div>
      <div>
        <p className="preLoginMessage">
          New user? Click "sign up" to register your account.
        </p>
        <Button className="mb-4" variant="outline-light" onClick={signUp}>
          Sign up
        </Button>
      </div>
      <div>
        <p className="preLoginMessage">
          Already have an account? Click "sign in" to log in.
        </p>
        <Button className="mb-4" variant="outline-light" onClick={signIn}>
          Sign in
        </Button>
      </div>
    </div>
  );
}

export default NewAuthForm;
