import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import logo from "../logo.png";
import "./App.css";
import Composer from "./Composer.js";
import NewsFeed from "./NewsFeed.js";
import AuthForm from "./AuthForm.js";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, saved logged-in user to state
        setLoggedInUser(user);
        return;
      }

      // User is signed out
      setLoggedInUser(null);
    });
  }, []);

  const authForm = <AuthForm />;
  const composer = <Composer loggedInUser={loggedInUser} />;
  const loginButton = (
    <div>
      <Link to="authform">Create Account Or Sign In</Link>
      <br />
    </div>
  );
  const composerAndNewsFeed = (
    <div>
      {loggedInUser ? composer : loginButton}
      <br />
      <NewsFeed />
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> <br />
        <Routes>
          <Route path="/" element={composerAndNewsFeed} />
          <Route path="authform" element={authForm} />
        </Routes>
      </header>
    </div>
  );
};

export default App;
