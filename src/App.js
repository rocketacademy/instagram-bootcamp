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


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      //console.log(user);
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      }
    });
  }, []);

   
    return (
      <div className="App">
        <header className="App-header">
        {isLoggedIn ? <h2>Welcome back {user.email}</h2> : null}
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

        {isLoggedIn ? (<div><MessageSubmit />
          <PictureSubmit /><PictureList /></div>) : <UserAuth />}
          
          
          
        </header>
      </div>
    );
  }


export default App;
