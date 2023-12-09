import React from "react";

import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
// import AuthForm from "./AuthForm";
import NewAuthForm from "./NewAuthForm";
import PostForm from "./PostForm";
import Feed from "./Feed";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { Route, Routes, Link } from "react-router-dom";
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: false,
      user: null,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      if (user) {
        this.setState({ isUserLoggedIn: true, user: user });
      }
    });
  }

  signOut = (e) => {
    signOut(auth);
    this.setState({ isUserLoggedIn: false, user: null });
  };

  render() {
    const app = (
      <div>
        <div>
          {this.state.isUserLoggedIn ? (
            <p>
              Hi {this.state.user.email}! You are now logged in and can post!
            </p>
          ) : (
            <Link to="authform">Please sign up / sign in to post.</Link>
          )}
          {this.state.isUserLoggedIn && (
            <Button
              variant="outline-light"
              className="mb-5"
              onClick={this.signOut}
            >
              Sign out
            </Button>
          )}
          {this.state.isUserLoggedIn && <PostForm />}
        </div>
        <div className="feed mt-4">
          <Feed />
        </div>
      </div>
    );

    return (
      <div className="App">
        <header>Rocketgram 🚀</header>
        <Routes>
          <Route path="/" element={app} />
          <Route path="authform" element={<NewAuthForm />} />
        </Routes>
      </div>
    );
  }
}

export default App;
