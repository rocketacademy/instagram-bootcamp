import React from "react";

import "./App.css";
import PictureList from "./Components/PictureList";
import PictureSubmit from "./Components/PictureSubmit";
import MessageSubmit from "./Components/MessageSubmit";
// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
import { useState, useEffect } from "react";
import UserAuth from "./Components/UserAuth";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import MyNavbar from "./Components/MyNavBar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // user is like state in class components, setUser is like setState
  const [user, setUser] = useState({});

  // useEffect triggers when the particular component re-renders similiar to ComponentDidMount and ComponentDidUpdate in class components
  // As useEffect is only one function instead of two, stricter restrictions are needed
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      {isLoggedIn ? <MyNavbar /> : null}
        {isLoggedIn ? <h2>Welcome back {user.displayName}</h2> : null}
        {isLoggedIn ? (
          <button
            onClick={(e) => {
              setIsLoggedIn(false);
              signOut(auth);
              setUser({});
            }}
          >
            Logout!
          </button>
        ) : null}

        {isLoggedIn ? (
          user.displayName ? (
            <div>
              <MessageSubmit displayName={user.displayName} />
              <PictureSubmit displayName={user.displayName} />
              <PictureList />
            </div>
          ) : (
            <p>Press F5 to refresh the page if username is not displayed</p>
          )
        ) : (
          <div>
            Please enter your username, email and password to sign-up
            <br />
            You may leave the username field blank if you are signing-in
            
            <UserAuth />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
