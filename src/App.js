import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Feed from "../src/Components/Feed/Feed";
import Chat from "../src/Components/Chat/Chat";
import AuthForm from "../src/Components/AuthForm/AuthForm";
import "./App.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </header>
    </div>
  );
}

function AppRoutes() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loggedInUser, setLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user);
      if (user) {
        setLoggedIn(true);
        console.log("User logged in");
        navigate("/");
      } else {
        setLoggedIn(false);
        console.log("User loggedIn is false");
        navigate("/auth");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  console.log("loggedInUser state:", loggedInUser);

  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/auth" element={<AuthForm setLoggedIn={setLoggedIn} />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}
