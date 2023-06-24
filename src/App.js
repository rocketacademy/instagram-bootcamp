import React from "react";
import "./App.css";
import { auth } from "./firebase";
import {
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

//import UI component from Mui
import { Box, Grid } from "@mui/material";
import { Button, TextField } from "@mui/material";

import MessageList from "./Component/MessageList";
import ChatCall from "./Component/ChatCall";
import PostForm from "./Component/PostForm";
import PostList from "./Component/PostList";
import Navbar from "./Component/UI/Navbar";

class App extends React.Component {
  constructor() {
    super();
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      currentPage: "home",
      userID: "",
      chatroom: false,
      postroom: true,
      isLoggedIn: false,
      email: "",
      displayName: "",
      password: "",
      pages: { login: true, signup: false, forgetpassword: false },
    };
  }

  componentDidMount = () => {
    const { displayName } = this.state;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        updateProfile(user, {
          displayName: displayName,
        }).then(() =>
          console.log("Profile Updated!").catch((error) => {
            console.log("Update profile error : ", error);
          })
        );
        const uid = user.email;
        this.setState({ userID: uid, isLoggedIn: true });
      } else {
        console.log("Logged out!");
        this.setState({ userID: "", isLoggedIn: false, displayName: "" });
      }
    });
  };

  handleClick = (name) => {
    if (name === "Chatroom") {
      this.setState({
        chatroom: true,
        postroom: false,
      });
    } else if (name === "Posts") {
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
        <Navbar pageClick={this.handleClick} />
        <header className="App-header">
          <h2>Welcome to Rocketgram! 🚀</h2>
          <Grid container xs={12} lg={8} justifyContent="center">
            <Grid item xs={6} lg={6}>
              {postroom && this.state.isLoggedIn ? (
                <Box bgcolor="inherit" p={2}>
                  <div justify="center">
                    <PostForm userID={this.state.displayName} />
                    <br />
                  </div>
                </Box>
              ) : chatroom && this.state.isLoggedIn ? (
                <Box bgcolor="inherit" p={2}>
                  <ChatCall userID={this.state.displayName} />
                </Box>
              ) : !this.state.isLoggedIn && login ? (
                <Box textAlign="left">
                  <Grid item xs={10}>
                    <p>Please login to chat or post.</p>
                    <p>If you are a new user, please click on Sign Up.</p>
                  </Grid>
                  <Grid>
                    <Box xs={7} lg={6}>
                      <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
                        <TextField
                          type="text"
                          name="email"
                          label="Email"
                          color="secondary"
                          variant="filled"
                          value={this.state.email}
                          onChange={this.handleInput}
                          size="small"
                          InputProps={{ sx: { height: 45 } }}
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
                          InputProps={{ sx: { height: 45 } }}
                          focused
                          required
                        />
                        <br />
                        <Box
                          component="span"
                          m={1}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          width="20"
                        >
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={this.handleLogin}
                            size="small"
                          >
                            Submit
                          </Button>

                          <Button
                            name="signup"
                            color="secondary"
                            variant="contained"
                            size="small"
                            onClick={this.changePage}
                          >
                            Sign Up
                          </Button>
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                </Box>
              ) : !this.state.isLoggedIn && signup ? (
                <Box textAlign="left">
                  <Grid item xs={10}>
                    <p>Please sign up to chat or post.</p>
                    <p>To login, please click on Login.</p>
                  </Grid>
                  <Grid>
                    <Box xs={7} lg={6}>
                      <Grid item xs={10} sm={7} md={5} lg={5} xl={5}>
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

                        <Box
                          component="span"
                          m={1}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          width="20"
                        >
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={this.handleSignup}
                          >
                            Submit
                          </Button>
                          <Button
                            name="login"
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={this.changePage}
                          >
                            Login
                          </Button>
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                </Box>
              ) : this.state.isLoggedIn ? (
                <div>
                  <Button variant="contained" onClick={this.handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                ""
              )}
            </Grid>
            <Grid item>
              <Box bgcolor="inherit" p={2}>
                {chatroom ? (
                  <div>
                    <MessageList />
                  </div>
                ) : postroom ? (
                  <div>
                    <PostList />
                  </div>
                ) : (
                  "No list available"
                )}
              </Box>
            </Grid>
          </Grid>
        </header>
      </div>
    );
  }
}

export default App;
