import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import logo from "../logo.png";
import "./App.css";
import Composer from "./Composer";
import NewsFeed from "./NewsFeed";
import AuthForm from "./AuthForm";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [shouldRenderAuthForm, setShouldRenderAuthForm] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser({ loggedInUser: user });
      } else {
        setLoggedInUser({ loggedInUser: null });
      }
    });
  }, []);

  const toggleAuthForm = () => {
    setShouldRenderAuthForm(true);
  };

  const authForm = <AuthForm toggleAuthForm={toggleAuthForm} />;
  const composer = <Composer loggedInUser={loggedInUser} />;
  const createAccountOrSignedInButton = (
    <div>
      <button onClick={toggleAuthForm}>Create Account or Sign In</button>
    </div>
  );
  const composerAndNewsFeed = (
    <div>
      {loggedInUser ? composer : createAccountOrSignedInButton}
      <NewsFeed />
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br />
        {shouldRenderAuthForm ? authForm : composerAndNewsFeed}
      </header>
    </div>
  );
};

export default App;
