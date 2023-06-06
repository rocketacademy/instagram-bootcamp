import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./logo512.png";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import AuthForm from "./Components/AuthForm";
import Composer from "./Components/Composer";
import PostFeed from "./Components/PostFeed";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [shouldRenderAuthForm, setShouldRenderAuthForm] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user);
      } else {
        setLoggedInUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleAuthForm = () => {
    setShouldRenderAuthForm((prevState) => !prevState);
  };

  const createAccountOrSignInButton = (
    <div>
      <button onClick={toggleAuthForm} className="button">
        Create Account Or Sign In
      </button>
    </div>
  );

  const composer = <Composer loggedInUser={loggedInUser} />;

  const composerAndNewsFeed = (
    <div>
      <div className="composerAndNewsFeed-Container">
        {loggedInUser ? composer : createAccountOrSignInButton}
      </div>
      <span id="posts-heading">All Posts Below:</span>
      <div className="horizontal-scrollable-card-deck-container">
        <PostFeed />
      </div>
    </div>
  );

  const authForm = <AuthForm toggleAuthForm={toggleAuthForm} />;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {shouldRenderAuthForm ? authForm : composerAndNewsFeed}
      </header>
    </div>
  );
}

export default App;
