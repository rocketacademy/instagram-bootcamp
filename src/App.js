import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { auth } from "./firebase";
import {
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Routes, Route, useNavigate } from "react-router-dom";

import ChatCallHooks from "./Pages/ChatCallHooks";
import PostForm from "./Pages/PostForm";
import Navbar from "./Component/Navbar";
import Welcome from "./Pages/Welcome";
import SignUp from "./Pages/SignUp";
import ErrorPage from "./Pages/ErrorPage";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Swal from "sweetalert2";

export const UserContext = React.createContext(null);

export default function App() {
  const [userID, setUserID] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState("false");
  const [displayName, setDisplayName] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const navigate = useNavigate();
  const user = useMemo(() => {
    return {
      userID: userID,
      displayName: displayName,
      isLoggedIn: isLoggedIn,
      avatarURL: avatarURL,
    };
  }, [userID, displayName, isLoggedIn, avatarURL]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("Auth State Changed!");
      if (user) {
        setIsLoggedIn(true);
        const uid = user.uid;
        setUserID(uid);
        if (user.displayName !== null) {
          setDisplayName(user.displayName);
          console.log(displayName);
        }
      } else {
        setIsLoggedIn(false);
        setDisplayName("");
        setUserID(null);
      }
    });
  });

  const handleSignup = (email, password, name) => {
    console.log(email, password, name);
    createUserWithEmailAndPassword(auth, email, password).then((userCred) => {
      console.log("Sign up success!");
      console.log(userCred);
      setIsLoggedIn(true);
      setUserID(userCred.user.uid);
      console.log("Name is ", name);
      setDisplayName(name);
      updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: "",
      })
        .then(() => {
          console.log("Profile Updated! ", displayName);
          Swal.fire({
            icon: "success",
            title: "Yay!",
            text: "Successfully signed up!",
            footer: "You can now check out the profile page",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/instagram-bootcamp/");
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password).then((userCred) => {
      console.log("success sign in!");
      console.log(userCred);
      const user = userCred;
      console.log(user);
      setIsLoggedIn(true);
      setUserID(user.user.uid);
      navigate("/instagram-bootcamp");
    });
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log("success sign OUT!");
      setUserID("");
      setIsLoggedIn(false);
      setDisplayName("");
      setAvatarURL("");
      navigate("/instagram-bootcamp");
    });
  };

  useEffect(() => {
    const currUser = auth.currentUser;
    if (currUser !== null) {
      setAvatarURL(currUser.photoURL);
      console.log(avatarURL);
      console.log(currUser.photoURL);
      user.avatarURL = currUser.photoURL;
    }
  }, [setAvatarURL, avatarURL, user]);

  return (
    <UserContext.Provider value={user}>
      <div className="App">
        <Navbar logout={handleLogout} avatarURL={avatarURL} />
        <header className="App-header">
          <h2>Welcome to Rocketgram! 🚀</h2>
          <Routes>
            <Route path="/instagram-bootcamp" element={<Welcome />} />
            <Route
              path="/instagram-bootcamp/signup"
              element={<SignUp signup={handleSignup} />}
            />
            <Route
              path="/instagram-bootcamp/login"
              element={<Login handleLogin={handleLogin} />}
            />
            <Route path="/instagram-bootcamp/profile" element={<Profile />} />
            <Route
              path="/instagram-bootcamp/chat"
              element={<ChatCallHooks />}
            />
            <Route
              path="/instagram-bootcamp/posts"
              element={<PostForm />}
            ></Route>
            <Route path="*" element={<ErrorPage />}></Route>
          </Routes>
        </header>
      </div>
    </UserContext.Provider>
  );
}
