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
        this.setState({
          authenticated: true,
          loginFormShow: false,
          user: user,
        });
      } else {
        this.setState({
          authenticated: false,
          loginFormShow: true,
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
    createUserWithEmailAndPassword(auth, email, password).catch((error) => {
      this.showAlert(error);
    });
  };

  signInUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      this.showAlert(error);
    });
  };

  signOutUser = () => {
    signOut(auth).catch((error) => {
      this.showAlert(error);
    });
  };

  showAlert = (error) => {
    const errorCode = error.code;
    const errorMessage = errorCode.split("/")[1].replaceAll("-", " ");
    alert(`Wait a minute... an error occurred: ${errorMessage}`);
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
                <NavDropdown
                  title={`Welcome, ${this.state.user.email}`}
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item onClick={this.signOutUser}>
                    Sign out
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
                  Log in or sign up to post
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
