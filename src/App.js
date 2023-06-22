import React from "react";
import "./App.css";
import { auth } from "./firebase";
import {
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

//import UI component from Mui
// import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";

import { Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MessageList from "./Component/MesssageList";
import ChatCall from "./Component/ChatCall";
import PostForm from "./Component/PostForm";
import PostList from "./Component/PostList";
import { TextField } from "@mui/material";

class App extends React.Component {
  constructor() {
    super();
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      currentPage: "home",
      userID: "",
      chatroom: false,
      postroom: false,
      isLoggedIn: false,
      email: "",
      displayName: "",
      password: "",
      pages: { login: true, signup: false, forgetpassword: false },
    };
  }

  componentDidMount = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        const uid = user.uid;
        this.setState({ userID: uid, isLoggedIn: true });
      } else {
        console.log("Logged out!");
        this.setState({ userID: "", isLoggedIn: false });
      }
    });
  };

  handleClick = (e) => {
    const { name } = e.target;
    if (name === "chatroom") {
      this.setState({
        chatroom: true,
        postroom: false,
      });
    } else if (name === "postroom") {
      this.setState({
        postroom: true,
        chatroom: false,
      });
    }
  };

  handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  };

  handleSignup = () => {
    const { email, password } = this.state;
    createUserWithEmailAndPassword(auth, email, password).then((userCred) => {
      console.log("Sign up success!");
      console.log(userCred);
      const user = userCred.user;
      console.log(user);
      // ...
    });
  };

  handleLogin = () => {
    const { email, password } = this.state;
    signInWithEmailAndPassword(auth, email, password).then((userCred) => {
      console.log("success sign in!");
      console.log(userCred);
      const user = userCred.user;
      console.log(user);
    });
  };

  handleLogout = () => {
    signOut(auth).then(() => {
      console.log("success sign OUT!");
      this.setState({
        currentPage: "home",
        userID: "",
        chatroom: false,
        postroom: false,
        isLoggedIn: false,
        email: "",
        displayName: "",
        password: "",
        pages: { login: true, signup: false, forgetpassword: false },
      });
    });
  };

  changePage = (e) => {
    const name = e.target.name;
    let newPage = {};
    if (name === "signup") {
      newPage = { login: false, signup: true, forgetpassword: false };
    } else if (name === "login") {
      newPage = { login: true, signup: false, forgetpassword: false };
    }
    this.setState({
      pages: newPage,
    });
  };

  render() {
    const { chatroom, postroom } = this.state;
    const { login, signup } = this.state.pages;
    return (
      <div className="App">
        <header className="App-header">
          <h2>Welcome to Rocketgram! 🚀</h2>

          {!this.state.isLoggedIn && login ? (
            <div>
              <h3>Please login to chat or post.</h3>
              <h4>If you are a new user, please click on Sign Up.</h4>
              <Button
                name="signup"
                variant="contained"
                onClick={this.changePage}
              >
                Sign Up
              </Button>
              <div>
                <br />
                <TextField
                  type="text"
                  name="email"
                  label="Email"
                  color="secondary"
                  variant="filled"
                  value={this.state.email}
                  onChange={this.handleInput}
                  size="small"
                  focused
                  required
                />
                <br />
                <TextField
                  type="password"
                  name="password"
                  label="Password"
                  color="secondary"
                  variant="filled"
                  value={this.state.password}
                  onChange={this.handleInput}
                  size="small"
                  focused
                  required
                />
                <br />
                <Button variant="contained" onClick={this.handleLogin}>
                  Login
                </Button>
              </div>
            </div>
          ) : !this.state.isLoggedIn && signup ? (
            <div>
              <h3>Please sign up to chat or post.</h3>
              <h4>To login, please click on Login.</h4>
              <Button
                name="login"
                variant="contained"
                onClick={this.changePage}
              >
                Login
              </Button>
              <br />
              <br />
              <TextField
                type="text"
                name="displayName"
                label="Display Name"
                color="secondary"
                variant="filled"
                value={this.state.displayName}
                onChange={this.handleInput}
                size="small"
                focused
                required
              />
              <br />
              <TextField
                type="text"
                name="email"
                label="Email"
                color="secondary"
                variant="filled"
                value={this.state.email}
                onChange={this.handleInput}
                size="small"
                focused
                required
              />
              <br />

              <TextField
                type="password"
                name="password"
                label="Password"
                color="secondary"
                variant="filled"
                value={this.state.password}
                onChange={this.handleInput}
                size="small"
                focused
                required
              />
              <br />
              <Button variant="contained" onClick={this.handleSignup}>
                Sign Up
              </Button>
            </div>
          ) : this.state.isLoggedIn ? (
            <div>
              <h3>Choose a page to visit.</h3>

              <Button
                variant="contained"
                endIcon={<ChatIcon />}
                name="chatroom"
                onClick={this.handleClick}
              >
                Chatroom
              </Button>

              <Button
                variant="contained"
                endIcon={<PostAddIcon />}
                name="postroom"
                onClick={this.handleClick}
              >
                Posts
              </Button>

              <Button variant="contained" onClick={this.handleLogout}>
                Logout
              </Button>

              {chatroom && (
                <div>
                  <MessageList />
                  <br />
                  <ChatCall userID={this.state.userID} />
                </div>
              )}

              {postroom && (
                <div justify="center">
                  <PostForm userID={this.state.userID} />
                  <br />
                  <PostList />
                </div>
              )}
            </div>
          ) : (
            "No page available. Sorry!"
          )}
        </header>
      </div>
    );
  }
}

export default App;
