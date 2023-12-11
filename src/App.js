import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Feed from "./components/Feed";
import AuthForm from "./components/AuthForm";
import Messenger from "./components/Messenger";
import Post from "./components/Post";

import "./App.css";

export const UserContext = React.createContext();

const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState("");

  //on first page loads, determine if user is logged in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsUserLoggedIn(true);
      } else {
        setUser({});
        setIsUserLoggedIn(false);
      }
    });
  }, []);

  const value = {
    user,
    setUser,
    isUserLoggedIn,
    setIsUserLoggedIn,
    msg,
    setMsg,
  };

  return (
    <>
      <div className="App">
        <UserContext.Provider value={value}>
          <BrowserRouter>
            <NavBar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/authform" element={<AuthForm />} />
              <Route path="/messenger" element={<Messenger />} />
              <Route path="/feed/post" element={<Post />} />
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </div>
    </>
  );
};

export default App;
