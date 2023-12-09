import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AppHome from "./Components/AppHome";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import NewsFeedMain from "./Components/NewsFeedMain";
import AuthFormMain from "./Components/AuthFormMain";

const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);

root.render(
  <BrowserRouter>
    <Link to="/home">Home</Link>
    <Link to="/">Login</Link>
    <Link to="newsfeed">NewsFeed</Link>

    <Routes>
      <Route path="/" element={<AuthFormMain />} />
      <Route path="/newsfeed" element={<NewsFeedMain />} />
      <Route path="/home" element={<AppHome />} />
    </Routes>
  </BrowserRouter>
);
