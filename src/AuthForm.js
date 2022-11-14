import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ showSignInForm }) => {
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

  let navigate = useNavigate();

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

    navigate("/");
  };

  return (
    <div>
      <h1>Register New User</h1>
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
        Sign-In if you already have an account
      </Button>
    </div>
  );
};

const SignInForm = ({ showRegistrationForm }) => {
  const [currentUserAccount, setCurrentUserAccount] = useState({
    email: "",
    password: "",
  });

  let navigate = useNavigate();

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

    navigate("/");
  };

  const onUserInput = (event) => {
    setCurrentUserAccount({
      ...currentUserAccount,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <h1>Sign In</h1>
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
        Register a New Account
      </Button>
    </div>
  );
};

const AuthForm = () => {
  //if show registration form is set to false, sign in form will show//
  const [showRegistrationForm, setShowRegistrationForm] = useState(true);

  const toggleForm = () => {
    setShowRegistrationForm(!showRegistrationForm);
  };

  return (
    <div>
      {showRegistrationForm ? (
        <RegisterForm showSignInForm={toggleForm} />
      ) : (
        <SignInForm showRegistrationForm={toggleForm} />
      )}
    </div>
  );
};

export default AuthForm;
