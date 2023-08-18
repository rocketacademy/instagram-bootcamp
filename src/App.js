import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

//routing
import { Routes, Route } from "react-router-dom";
import AuthProvider from "./Component/AuthProvider";

// import components
import InstagramFeed from "./Component/InstagramFeed.js";
import InstagramForm from "./Component/InstagramForm";
import AuthField from "./Component/AuthField";
import Header from "./Component/Header";

// firebase
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

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
  const authForm = <AuthField />;
  // const composer = <InstagramForm loggedInUser={loggedInUser} />;
  const composer = <InstagramForm />;
  const composerAndNewsFeed = (
    <div>
      {/* Render composer if user logged in, else render nothing */}
      {loggedInUser ? composer : null}
      <br />
      <InstagramFeed />
    </div>
  );

  return (
    <div className="App">
      <AuthProvider>
        <div className="app-container">
          <br />
          <Header />
          <div className="content-container">
            <Routes>
              <Route path="/" element={composerAndNewsFeed} />
              <Route path="authform" element={authForm} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </div>
  );
};

export default App;
