import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import "./App.css";
import AuthForm from "./AuthForm";
import Composer from "./Composer";
import NewsFeed from "./NewsFeed";
import { auth } from "../firebase";
import logo from "../logo.png";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      if (user) {
        setLoggedInUser(user);
        return;
      }
      // Else set logged-in user in state to null
      setLoggedInUser(null);
    });
  }, []);

  // Initialise components to render in variables for organisational purposes
  const authForm = <AuthForm />;
  const composer = <Composer loggedInUser={loggedInUser} />;
  const createAccountOrSignInButton = (
    <div>
      <Link to="authform">Create Account Or Sign In</Link>
      <br />
    </div>
  );
  const composerAndNewsFeed = (
    <div>
      {/* Render composer if user logged in, else render auth button */}
      {loggedInUser ? composer : createAccountOrSignInButton}
      <br />
      <NewsFeed />
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br />
        <Routes>
          <Route path="/" element={composerAndNewsFeed} />
          <Route path="authform" element={authForm} />
        </Routes>
      </header>
    </div>
  );
};

export default App;
