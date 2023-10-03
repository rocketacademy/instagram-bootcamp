import React from "react";
import AuthForm from "./Component/AuthForm";
// import PostForm from "./Component/PostForm";
// import PostList from "./Component/PostList";
import PostFormHook from "./Component/PostFormHook";
import PostListHook from "./Component/PostListHook";
// import CommentForm from "./Component/CommentForm";
// import CommentList from "./Component/CommentList";
import "./App.css";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="welcome-logout">
          {isLoggedIn ? (
            <h2 className="welcome-back">
              Welcome back {auth.currentUser.displayName}!
            </h2>
          ) : null}
          {isLoggedIn ? (
            <button
              className="logout-button"
              onClick={() => {
                signOut(auth);
              }}
            >
              LogOut
            </button>
          ) : null}
        </div>
        {isLoggedIn ? (
          <div>
            <PostListHook setUser={setUser} />
            <PostFormHook setUser={setUser} />
          </div>
        ) : (
          <AuthForm setUser={setUser} />
        )}
        {/* <CommentList />
          <CommentForm /> */}
      </header>
    </div>
  );
}

export default App;
