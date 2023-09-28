import React, { useState, useEffect } from "react";
import { database, auth } from "./firebase";
import {
  ref,
  onChildAdded,
  onChildRemoved,
  push,
  set,
} from "firebase/database";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import logo from "./logo.png";
import "./App.css";

const DB_MESSAGES_KEY = "messages";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [postMessage, setPostMessage] = useState("");
  const [postTimestamp, setPostTimestamp] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);

    const childAddedUnsub = onChildAdded(messagesRef, (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    });

    const childRemovedUnsub = onChildRemoved(messagesRef, (data) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.key !== data.key)
      );
    });

    const authUnsub = onAuthStateChanged(auth, (userInfo) => {
      setIsLoggedIn(!!userInfo);
    });

    return () => {
      childAddedUnsub();
      childRemovedUnsub();
      authUnsub();
    };
  }, []);

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    setEmail("");
    setPassword("");
  };

  const handleSignup = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
    setEmail("");
    setPassword("");
  };

  const handlePasswordReset = async () => {
    await sendPasswordResetEmail(auth, email);
    setEmail("");
  };

  const writeData = async (e) => {
    e.preventDefault();
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messagesRef);
    const currentTime = new Date().toUTCString(); // Current time in UTC format
    await set(newMessageRef, {
      message: postMessage,
      timestamp: currentTime,
    });
    setPostMessage(""); // Clear the message input after submitting
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Rocketgram</p>
        {isLoggedIn ? (
          <>
            <form onSubmit={writeData}>
              <input
                type="text"
                id="post"
                placeholder="Post a message"
                onChange={(e) => setPostMessage(e.target.value)}
                value={postMessage}
              />
              <br />
              <input type="submit" />
            </form>
            <button onClick={signOut}>Sign out</button>
            <ol>
              {messages.map((message) => (
                <li key={message.key}>
                  {message.val.message} - {message.val.timestamp}
                </li>
              ))}
            </ol>
          </>
        ) : (
          <>
            <div>
              <input
                type="text"
                id="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div>
              <button onClick={handleSignup}>Sign up</button>
              <button onClick={handleLogin}>Log in</button>
              <button onClick={handlePasswordReset}>Forgot password</button>
            </div>
          </>
        )}
      </header>
    </div>
  );
};

export default App;
