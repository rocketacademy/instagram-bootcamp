import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Feed from "../src/Components/Feed/Feed";
import Chat from "../src/Components/Chat/Chat";
import AuthForm from "../src/Components/AuthForm/AuthForm";
import "./App.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function App() {
  const auth = getAuth();
  const [loggedInUser, setLoggedIn] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        return;
      }
      setLoggedIn(false);
    });
  }, [auth]);

  return (
    <div className="App">
      <header className="App-header">
        <br />
        <BrowserRouter>
          {loggedInUser ? <Navigate to="/" /> : <Navigate to="/auth" />}
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}
