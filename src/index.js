import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Enter from "./Components/Auth/Enter";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Home from "./Components/Home";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route exact path="/" element={<Enter />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/home" element={<Home />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
