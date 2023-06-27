import React, { useState, useEffect } from "react";
import logo from "./logo.png";
import "./App.css";
import Composer from "./Components/Composer";
import NewsFeed from "./Components/NewsFeed";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthForm from "./Components/AuthForm";
import {Container} from "react-bootstrap";
import {Navbar} from "react-bootstrap";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Post from "./Components/Post";

export const UserContext = React.createContext({});

function RequireAuth({ children, redirectTo, loggedInUser }) {
  console.log(loggedInUser);
  const isAutheticated = loggedInUser.uid && loggedInUser.accessToken;
  return isAutheticated ? children : <Navigate to={redirectTo} />;
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser) {
        setLoggedInUser(loggedInUser);
      }
    });
  }, [loggedInUser]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {loggedInUser.uid && loggedInUser.accessToken && (
          <Navbar>
            <Container>
              <Navbar.Brand href="#home">Signed in as: </Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                  <a href="#login">{loggedInUser.email}</a>
                </Navbar.Text>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        )}

        <UserContext.Provider value={loggedInUser}>
          {loggedInUser.uid && loggedInUser.accessToken ? null : (
            <Link to="login">
              <button>Create Account or Sign In</button>
            </Link>
          )}

          {loggedInUser.uid && loggedInUser.accessToken && (
            <button
              onClick={() => {
                signOut(auth).then(() => {
                  setLoggedInUser({});
                });
              }}
            >
              Logout!
            </button>
          )}

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <RequireAuth loggedInUser={loggedInUser}>
                    <Composer
                      email={loggedInUser.email}
                      loggedInUser={loggedInUser.uid}
                    />
                  </RequireAuth>

                  <NewsFeed loggedInUser={loggedInUser.uid} />
                </>
              }
            />
            <Route path="/login" element={<AuthForm />} />
            <Route
              path="/newsfeed"
              element={
                <>
                  <RequireAuth loggedInUser={loggedInUser}>
                    <Composer
                      email={loggedInUser.email}
                      loggedInUser={loggedInUser.uid}
                    />
                  </RequireAuth>
                  <NewsFeed loggedInUser={loggedInUser.uid} />
                </>
              }
            />
            <Route path="/post/:id" element={<Post />} />
          </Routes>
        </UserContext.Provider>
      </header>
    </div>
  );
}

export default App;
