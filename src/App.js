import { useState, useEffect } from "react";
import MainFeed from "./Components/Feed.js";
import LoginForm from "./Components/LoginForm.js";
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "./logo.png";
import "./App.css";

export default function App() {
  const [loginFormShow, setLoginFormShow] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        setLoginFormShow(false);
        setUser(user);
      } else {
        setAuthenticated(false);
        setLoginFormShow(true);
        setUser({});
      }
    });
  }, []);

  const handleLoginInput = (name, value) => {
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleLoginOrSignUp = (e) => {
    if (e.target.id === "login") {
      signInUser(email, password);
    } else if (e.target.id === "sign-up") {
      signUpUser(email, password);
    }
  };

  const signUpUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password).catch((error) => {
      showAlert(error);
    });
  };

  const signInUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      showAlert(error);
    });
  };

  const signOutUser = () => {
    signOut(auth).catch((error) => {
      showAlert(error);
    });
  };

  const showAlert = (error) => {
    const errorCode = error.code;
    const errorMessage = errorCode.split("/")[1].replaceAll("-", " ");
    alert(`Wait a minute... an error occurred: ${errorMessage}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <LoginForm
          show={loginFormShow}
          onHide={() => {
            setLoginFormShow(false);
          }}
          onChange={handleLoginInput}
          email={email}
          password={password}
          onClick={handleLoginOrSignUp}
        />
        <Navbar bg="dark" variant="dark" sticky="top">
          <Navbar.Brand href="#top">
            <img src={logo} className="App-logo" alt="logo" />
          </Navbar.Brand>
          {authenticated && !loginFormShow && (
            <Nav id="logged-in-nav">
              <NavDropdown
                title={`Welcome, ${user.email}`}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item onClick={signOutUser}>
                  Sign out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
          {!authenticated && !loginFormShow && (
            <Nav id="signed-out-nav">
              <Nav.Link
                onClick={() => {
                  setLoginFormShow(true);
                }}
              >
                Log in or sign up to post
              </Nav.Link>
            </Nav>
          )}
        </Navbar>
        <MainFeed
          authenticated={authenticated}
          email={user.email}
          uid={user.uid}
        />
      </header>
    </div>
  );
}
