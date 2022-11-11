import React from "react";
import "./App.css";
import logo from "./logo.png";
import InstagramChat from "./Components/instagram-chat";
import InstagramPost from "./Components/instagram-post";
import InstagramAuth from "./Components/Instagram-authentication";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <InstagramChat />
        <InstagramPost />
        <InstagramAuth />
      </header>
    </div>
  );
}

export default App;
