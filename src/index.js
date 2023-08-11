import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForm from "./Components/AuthForm";
import Newsfeed from "./Components/Newsfeed";
import Chat from "./Components/Chat";
import PureNewsfeed from "./Components/PureNewsfeed";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/authForm" element={<AuthForm />} />
      <Route path="/newsfeed" element={<Newsfeed />} />
      <Route path="/purenewsfeed" element={<PureNewsfeed />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  </BrowserRouter>
);
