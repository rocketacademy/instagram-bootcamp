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
import { CreateUserForm } from "./components/CreateUserForm";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { LoginForm } from "./components/LoginForm";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling

export default function App() {
  // Initialise empty messages array in state to keep local state in sync with Firebase
  // When Firebase changes, update local state, which will update local UI
  const [name, setName] = useState("");
  const [chat, setChat] = useState("");
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState(1);

  const auth = getAuth();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [user]);

  const writeData = (e) => {
    e.preventDefault();
    createMessageLog({ name: name, chat: chat, timestamp: Date.now() });
    console.log("write");
  };

  return (
    <div className="App">
      <header className="App-header">
        {!user && newUser === 1 && (
          <CreateUserForm user={user} setNewUser={setNewUser} />
        )}
        {!user && newUser === 0 && (
          <LoginForm user={user} setNewUser={setNewUser} />
        )}
        {user && (
          <>
            <img src={logo} className="App-logo" alt="logo" />
            <form onSubmit={writeData}>
              <div className="form-item">
                <label htmlFor="name">Name</label>
                <br></br>
                <input
                  name="name"
                  value={name}
                  id="name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setChat(e.target.value);
                  }}
                />
              </div>
              <button type="submit">Send</button>
            </form>

            <ChatList />
            <br></br>
            <FileUpload />
            <p onClick={() => signOut(auth)}>Logout</p>
          </>
        )}
      </header>
    </div>
  );
}
