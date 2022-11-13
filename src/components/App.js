import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import logo from "../logo.png";
import "./App.css";
import Composer from "./Composer";
import NewsFeed from "./NewsFeed";
import AuthForm from "./AuthForm";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user);
      } else {
        setLoggedInUser(null);
      }
    });
  }, []);

  const authForm = <AuthForm />;
  const composer = <Composer loggedInUser={loggedInUser} />;
  const createAccountOrSignedInButton = (
    <div>
      <Link to="/authform">Create Account or Sign In</Link>
    </div>
  );
  const composerAndNewsFeed = (
    <div>
      {loggedInUser ? composer : createAccountOrSignedInButton}
      <NewsFeed />
    </div>
  );

  // console.log(loggedInUser);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={composerAndNewsFeed} />
            <Route path="/authform" element={authForm} />
          </Routes>
        </BrowserRouter>
        <br />
      </header>
    </div>
  );
};

export default App;
