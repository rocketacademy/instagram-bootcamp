import React, { useEffect, useState } from "react";
import Composer from "./Composer";
import NewsFeed from "./NewsFeed";
import AuthForm from "./AuthForm";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Routes, Route, Link } from "react-router-dom";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user);
        return;
      } else {
        setLoggedInUser(null);
      }
    });
  }, []);

  const authForm = <AuthForm />;
  const composer = <Composer loggedInUser={loggedInUser} />;
  const createAccountOrSignInButton = (
    <div>
      <Link to="authform">Create Account Or Sign In</Link>
    </div>
  );
  const composerAndNewsFeed = (
    <div>
      {loggedInUser ? composer : createAccountOrSignInButton}
      <br />
      <NewsFeed />
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={composerAndNewsFeed} />
          <Route path="/authform" element={authForm} />
        </Routes>
      </header>
    </div>
  );
};

export default App;
