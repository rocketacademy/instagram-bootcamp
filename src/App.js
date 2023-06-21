import React, { useState, useEffect } from "react";
import logo from "./logo.png";
import "./App.css";
import Composer from "./Components/Composer";
import NewsFeed from "./Components/NewsFeed";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthForm from "./Components/AuthForm";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import {
  onChildAdded,
  ref as databaseRef,
  onChildRemoved,
} from "firebase/database";
import { database } from "./firebase";

export const UserContext = React.createContext({});
// Save the Firebase post folder name as a constant to avoid bugs due to misspelling
const POST_KEY = "posts";

function RequireAuth({ children, redirectTo, loggedInUser }) {
  console.log(loggedInUser);
  const isAutheticated = loggedInUser.uid && loggedInUser.accessToken;
  return isAutheticated ? children : <Navigate to={redirectTo} />;
}

function App() {
  const [likeClicked, setLikeClicked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser) {
        setLoggedInUser(loggedInUser);
      }
    });
  }, [loggedInUser]);

  // Initialise empty posts array in state to keep local state in sync with Firebase
  // When Firebase changes, update local state, which will update local UI
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postRef = databaseRef(database, POST_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postRef, (data) => {
      console.log(data);
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setPosts((state) =>
        // Store posts key so we can use it as a key in our card items when rendering posts
        [...state, { key: data.key, val: data.val() }]
      );
    });
  }, []);

  useEffect(() => {
    const postRef = databaseRef(database, POST_KEY);
    // Delete the deleted post & image from state so it is no longer rendered when mounted
    onChildRemoved(postRef, (removedOldData) => {
      console.log("data onChildRemoved", removedOldData);
      const postsCopy = [...posts];
      const newPosts = postsCopy.filter(
        (post) => post.key !== removedOldData.key
      );
      setPosts(newPosts);
    });
  }, [posts]);

  const handleLikeCount = () => {
    setLikeCount((state) =>
      state.likeClicked ? state.likeCount + 1 : state.likeCount - 1
    );
  };

  const handleLikeButton = () => {
    setLikeClicked(
      (state) => !state.likeClicked,
      () => handleLikeCount()
    );
  };

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
                    <Composer email={loggedInUser.email} />
                  </RequireAuth>

                  <NewsFeed onclick={handleLikeButton} posts={posts} />
                </>
              }
            />
            <Route path="/login" element={<AuthForm />} />
            <Route
              path="/newsfeed"
              element={
                <>
                  <RequireAuth loggedInUser={loggedInUser}>
                    <Composer email={loggedInUser.email} />
                  </RequireAuth>
                  <NewsFeed onClick={handleLikeButton} posts={posts} />
                </>
              }
            />
          </Routes>
        </UserContext.Provider>
      </header>
    </div>
  );
}

export default App;
