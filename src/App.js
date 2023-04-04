import React, { useState, useEffect } from "react";
import NavBar from "./Components/NavBar.js";
import Feed from "./Components/Feed.js";
import LoginForm from "./Components/LoginForm.js";
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import PostWithComments from "./Components/PostWithComments.js";

export const UserContext = React.createContext({ email: null });

export default function App() {
  const [loginFormShow, setLoginFormShow] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate("/login-signup");
    } else {
      navigate("/");
    }
  }, [authenticated]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        setLoginFormShow(false);
        setUser(user);
      } else {
        setAuthenticated(false);
        setLoginFormShow(true);
        setUser({ email: null });
      }
    });
  }, []);

  const handleLoginInput = (name, value) => {
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleLoginOrSignUp = (e) => {
    if (e.target.id === "login") {
      signInUser(email, password);
      navigate("/");
    } else if (e.target.id === "sign-up") {
      signUpUser(email, password);
      navigate("/");
    }
  };

  const signUpUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password).catch((error) => {
      showAlert(error);
    });
  };

  const signInUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      showAlert(error);
    });
  };

  const signOutUser = () => {
    signOut(auth).catch((error) => {
      showAlert(error);
    });
  };

  const showAlert = (error) => {
    const errorCode = error.code;
    const errorMessage = errorCode.split("/")[1].replaceAll("-", " ");
    alert(`Wait a minute... an error occurred: ${errorMessage}`);
  };

  return (
    <div className="App">
      <UserContext.Provider value={user}>
        <header className="App-header">
          <NavBar
            user={user}
            authenticated={authenticated}
            loginFormShow={loginFormShow}
            signOutUser={signOutUser}
            setLoginFormShow={() => {
              setLoginFormShow(true);
              navigate("login-signup");
            }}
          />
          <Routes>
            <Route path="/" element={<Feed />}>
              <Route
                path="login-signup"
                element={
                  authenticated ? (
                    <Navigate to="/" />
                  ) : (
                    <LoginForm
                      show={true}
                      onHide={() => {
                        setLoginFormShow(false);
                        navigate("/");
                      }}
                      onChange={handleLoginInput}
                      email={email}
                      password={password}
                      onClick={handleLoginOrSignUp}
                    />
                  )
                }
              />
            </Route>
            <Route path="posts/:postId" element={<PostWithComments />} />
          </Routes>
        </header>
      </UserContext.Provider>
    </div>
  );
}
