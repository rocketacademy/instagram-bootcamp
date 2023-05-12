import React from "react";

import { Routes, Route } from "react-router-dom";
import App from "./App";
import LoginForm from "./LoginForm";
import SignUpFormHooks from "./SignUpFormHooks";

function Home() {
  return (
    <div>
      <h1>THIS IS MY INSTAGRAM APP</h1>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<SignUpFormHooks />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

export default Home;
