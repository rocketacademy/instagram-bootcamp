import React, { useEffect, useState } from "react";
import { AuthForm } from "./components/AuthForm";
import { Composer } from "./components/Composer";
import { NewsFeed } from "./components/NewsFeed";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import logo from "./logo.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav } from "./components/Nav";
import { signOut } from "firebase/auth";

export function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [shouldRenderAuthForm, setShouldRenderAuthForm] = useState(false);

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
  });

  const signOutUser = () => {
    signOut(auth).then(() => {
      setLoggedInUser(null);
    });
  };

  const toggleAuthForm = () => {
    setShouldRenderAuthForm(!shouldRenderAuthForm);
  };

  const authForm = <AuthForm toggleAuthForm={toggleAuthForm} />;
  const composer = <Composer loggedInUser={loggedInUser} />;
  const createAccountOrSignInButton = (
    <div>
      <button onClick={toggleAuthForm}>Create Account Or Sign In</button>
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
      <Nav loggedInUser={loggedInUser} signOutUser={signOutUser} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br />
        {shouldRenderAuthForm ? authForm : composerAndNewsFeed}
      </header>
    </div>
  );
}
