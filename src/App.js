import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { get, push, ref, remove, set } from "firebase/database";
import { database, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail as sendPasswordResetEmailFirebase,
} from "firebase/auth";
import Message from "./Component/Message";
import ChatContainer from "./Component/ChatContainer";
import ChatInput from "./Component/ChatInput";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "firebase/database";
import "./App.css";
import "./ChatContainer.css";
import "./ChatInput.css";
import "./Message.css";

const DB_MESSAGES_KEY = "messages";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isInputEnabled, setIsInputEnabled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);

    const messagesAddedListener = onChildAdded(messagesRef, (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          key: data.key,
          message: data.val().message,
          datetime: data.val().datetime,
          user: data.val().user,
        },
      ]);
    });

    const messagesChangedListener = onChildChanged(messagesRef, (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.key === data.key
            ? {
                key: data.key,
                message: data.val().message,
                datetime: data.val().datetime,
                user: data.val().user,
              }
            : message
        )
      );
    });

    const messagesRemovedListener = onChildRemoved(messagesRef, (data) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.key !== data.key)
      );
    });

    const authStateChangedListener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        setIsInputEnabled(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setIsInputEnabled(false);
      }
    });

    return () => {
      messagesAddedListener();
      messagesChangedListener();
      messagesRemovedListener();
      authStateChangedListener();
    };
  }, []);

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User signed up successfully!");
    } catch (error) {
      alert("Error signing up:", error.message);
    }
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        throw new Error("Error: Please type in your username and password.");
      }

      await signInWithEmailAndPassword(auth, email, password);
      alert("You have signed in.");
    } catch (error) {
      alert("Error: Wrong Username or Password was typed in.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newMessage.trim() !== "") {
      writeData();
    }
  };

  const writeData = () => {
    if (newMessage.trim() !== "") {
      const messageListRef = ref(database, DB_MESSAGES_KEY);
      const newMessageRef = push(messageListRef);
      const datetime = new Date().toLocaleString();

      try {
        set(newMessageRef, {
          message: newMessage,
          datetime,
          user: user.uid,
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error writing message:", error);
      }
    }
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleDeleteMessage = (messageKey) => {
    const messageRef = ref(database, `${DB_MESSAGES_KEY}/${messageKey}`);
    remove(messageRef);
  };

  const handleClearLog = () => {
    setMessages([]);
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    remove(messageListRef);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("User signed out");
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmailFirebase(auth, email);
      alert("Password reset email sent to: " + email);
    } catch (error) {
      alert("Error sending password reset email:", error.message);
    }
  };

  const handleEditMessage = (messageKey, editedMessage) => {
    const messageRef = ref(
      database,
      `${DB_MESSAGES_KEY}/${messageKey}/message`
    );
    set(messageRef, editedMessage);
  };

  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <>
                    <button onClick={handleLogout}>Logout</button>
                    <ChatContainer
                      messages={messages}
                      user={user}
                      onDeleteMessage={handleDeleteMessage}
                      onEditMessage={handleEditMessage}
                      MessageComponent={Message}
                    />
                    <ChatInput
                      newMessage={newMessage}
                      onInputChange={handleInputChange}
                      onSubmit={handleSubmit}
                      isInputEnabled={isInputEnabled}
                    />
                    <br></br>
                    <button onClick={handleClearLog}>Clear Log</button>
                  </>
                ) : (
                  <>
                    <label htmlFor="email">Email : </label>
                    <input
                      type="text"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter Email"
                    />
                    <br />
                    <label htmlFor="password">Password : </label>
                    <input
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter Password"
                    />
                    <br />
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={handleSignup}>Sign Up</button>
                    <button onClick={handleResetPassword} disabled={!email}>
                      Forget Password
                    </button>
                  </>
                )
              }
            />
          </Routes>
        </header>
      </Router>
    </div>
  );
};

export default App;
