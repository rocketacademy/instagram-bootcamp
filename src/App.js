import React from "react";
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

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginFormShow: false,
      authenticated: false,
      user: {},
      email: "",
      password: "",
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user is signed in");
        this.setState({
          authenticated: true,
          user: auth.currentUser,
          loginFormShow: false,
        });
      } else {
        // not signed in
        console.log("user is not signed in");
        this.setState({
          loginFormShow: true,
          authenticated: false,
          user: {},
        });
      }
    });
  }

  handleLoginInput = (name, value) => {
    this.setState({ [name]: value });
  };

  handleLoginOrSignUp = (e) => {
    if (e.target.id === "login") {
      this.signInUser(this.state.email, this.state.password);
    } else if (e.target.id === "sign-up") {
      this.signUpUser(this.state.email, this.state.password);
    }
  };

  signUpUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // this.setState({ user: user });
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.errorMessage;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  signInUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.errorMessage;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  signOutUser = () => {
    signOut(auth)
      .then(() => {
        console.log("User has signed out.");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <LoginForm
            show={this.state.loginFormShow}
            onHide={() => {
              this.setState({ loginFormShow: false });
            }}
            onChange={this.handleLoginInput}
            email={this.state.email}
            password={this.state.password}
            onClick={this.handleLoginOrSignUp}
          />
          <Navbar bg="dark" variant="dark" sticky="top">
            <Navbar.Brand href="#top">
              <img src={logo} className="App-logo" alt="logo" />
            </Navbar.Brand>
            {this.state.authenticated && !this.state.loginFormShow && (
              <Nav id="logged-in-nav">
                <Nav.Link onClick={this.signOutUser}>Sign out</Nav.Link>
                <NavDropdown title="Account" id="collasible-nav-dropdown">
                  <NavDropdown.Item>
                    {`Welcome, ${this.state.user.email}`}
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Placeholder
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
            {!this.state.authenticated && !this.state.loginFormShow && (
              <Nav id="signed-out-nav">
                <Nav.Link
                  onClick={() => {
                    this.setState({ loginFormShow: true });
                  }}
                >
                  Log in or sign up
                </Nav.Link>
              </Nav>
            )}
          </Navbar>
          <MainFeed
            authenticated={this.state.authenticated}
            email={this.state.user.email}
            uid={this.state.user.uid}
          />
        </header>
      </div>
    );
  }
}
