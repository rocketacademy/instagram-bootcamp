import React, { useState, useEffect } from "react";
import { onChildAdded, onValue, push, ref, set } from "firebase/database";
import { uploadBytes } from "firebase/storage";
import { app, database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import { createMessageLog } from "./firebase";
import { ChatList } from "./components/ChatList";
import { FileUpload } from "./components/FileUpload";
import "bootstrap/dist/css/bootstrap.min.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling


export default function App() {
  // Initialise empty messages array in state to keep local state in sync with Firebase
  // When Firebase changes, update local state, which will update local UI
  const [name, setName] = useState("");
  const [chat, setChat] = useState("");
  const [timeStamp, setTimeStamp] = useState("");

  function handleNameChange(e) {
    setName(e.target.value);
    console.log("name")
  }

  function handleChatChange(e) {
    setChat(e.target.value);
    console.log("chat")
  }

  function writeData(e) {
    e.preventDefault();
    setTimeStamp(Date.now());
    createMessageLog({ name: name, chat: chat, timestamp: timeStamp });
    console.log("write")
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form onSubmit={writeData}>
          <div className="form-item">
            <label htmlFor="name">Name</label>
            <br></br>
            <input
              name="name"
              value={name}
              id="name"
              onChange={handleNameChange}
            />
          </div>
          <div className="form-item">
            <label htmlFor="description">Chat</label>
            <br></br>

            <textarea
              rows={5}
              name="chat"
              value={chat}
              style={{ width: "300px" }}
              onChange={handleChatChange}
            ></textarea>
          </div>
          <button type="submit">Send</button>
        </form>

        <ChatList />
        <br></br>
        <FileUpload />
      </header>
    </div>
  );
}
