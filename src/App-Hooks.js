import React, { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import { auth } from "./firebase.js";
import "./App.css";

import Login from "./pages/Login-Hooks.js";
import Feeds from "./pages/Feeds-Hooks.js";
import Search from "./pages/Search.js";
import PostUpload from "./pages/PostUpload-Hooks.js";
import Reels from "./pages/Reels.js";
import Profile from "./pages/Profile.js";
import Messenger from "./pages/Messenger-Hooks.js";
import ErrorPage from "./pages/ErrorPage";

import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();

const App = (props) => {
    const [user, setUser] = useState({});
    const [username, setUsername] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const infoToPass = {
      user,
      setUser,
      username,
      setUsername,
      isLoggedIn,
      setIsLoggedIn
    };
    
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User signed in
          setUser(user);
          setIsLoggedIn(true);
          //navigate("/Feeds");
        } else {
          // No sign in user
          setUser({});
          setIsLoggedIn(false);
          //navigate("/");
        }
      });
    }, []);
    
    return (
      <UserContext.Provider value={infoToPass}>
        <Routes>
            <Route
            path="/"
            element={<Login />}
            errorElement={<ErrorPage />}
            />
            <Route
            path="/Feeds"
            element={<Feeds />}
            errorElement={<ErrorPage />}
            />
            <Route
            path="/Search"
            element={<Search />}
            errorElement={<ErrorPage />}
            />
            <Route
            path="/PostUpload"
            element={<PostUpload />}
            errorElement={<ErrorPage />}
            />
            <Route
            path="/Reels"
            element={<Reels  />}
            errorElement={<ErrorPage />}
            />
            <Route
            path="/Profile"
            element={<Profile />}
            errorElement={<ErrorPage />}
            />
            <Route
            path="/Messenger"
            element={<Messenger />}
            errorElement={<ErrorPage />}
            />
        </Routes>
      </UserContext.Provider>
    );
}

export default App