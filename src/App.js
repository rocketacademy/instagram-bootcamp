import React from "react";
import "./App.css";
import Composer from "./Component/Composer";
import NewsFeed from "./Component/NewsFeed";
import AuthForm from "./Component/AuthForm";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        setUsername(capitalizeFirstLetter(user.email.split("@")[0]));
      }
    });
  }, []);
  console.log(user);
  console.log(username);
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {isLoggedIn ? <h2>Welcome {username}</h2> : null}
          {isLoggedIn ? (
            <button
              onClick={(e) => {
                setIsLoggedIn(false);
                signOut(auth);
                setUser({});
              }}
            >
              SignOut
            </button>
          ) : null}
          {isLoggedIn ? <Composer username={username} /> : <AuthForm />}
          <br /> <NewsFeed />
        </div>
      </header>
    </div>
  );
}

export default App;
