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
        {isLoggedIn ? <h2>Welcome back {user.displayName}</h2> : null}
        {isLoggedIn ? (
          <button
            onClick={() => {
              signOut(auth);
            }}
          >
            LogOut
          </button>
        ) : null}
        {isLoggedIn ? (
          <div>
            <PostListHook />
            <PostFormHook />
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
