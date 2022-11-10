import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import { useState } from "react";

const RegisterForm = ({ toggleForm, showSignInForm }) => {
  const onUserInput = (event) => {
    setNewUserAccount({
      ...newUserAccount,
      [event.target.name]: event.target.value,
    });
  };

  const [newUserAccount, setNewUserAccount] = useState({
    email: "",
    password: "",
  });

  const createNewUser = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(
      auth,
      newUserAccount.email,
      newUserAccount.password
    )
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

    toggleForm();
  };

  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>Register New User</Modal.Title>
      </Modal.Header>
      <Form onSubmit={createNewUser}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={onUserInput}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={onUserInput}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <Button variant="primary" onClick={showSignInForm}>
        Login Instead
      </Button>
    </div>
  );
};

const SignInForm = ({ toggleForm, showRegistrationForm }) => {
  const [currentUserAccount, setCurrentUserAccount] = useState({
    email: "",
    password: "",
  });

  const signInUser = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(
      auth,
      currentUserAccount.email,
      currentUserAccount.password
    )
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        console.log(error);
      });

    toggleForm();
  };

  const onUserInput = (event) => {
    setCurrentUserAccount({
      ...currentUserAccount,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>
      <Form onSubmit={signInUser}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={onUserInput}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={onUserInput}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <Button variant="primary" onClick={showRegistrationForm}>
        Login Instead
      </Button>
    </div>
  );
};

const AuthForm = ({ showForm, toggleForm }) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(true);
  const [showSignInForm, setShowSignInForm] = useState(false);

  const toggleRegistrationForm = () => {
    setShowRegistrationForm(true);
    setShowSignInForm(false);
  };

  const toggleSignInForm = () => {
    setShowRegistrationForm(false);
    setShowSignInForm(true);
  };

  return (
    <Modal show={showForm} onHide={toggleForm}>
      {showRegistrationForm ? (
        <RegisterForm
          toggleForm={toggleForm}
          showSignInForm={toggleSignInForm}
        />
      ) : (
        <SignInForm
          toggleForm={toggleForm}
          showRegistrationForm={toggleRegistrationForm}
        />
      )}
    </Modal>
  );
};

export default AuthForm;
