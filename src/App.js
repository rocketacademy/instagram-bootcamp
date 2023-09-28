import React, { useState, useEffect } from "react";
import "./App.css";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  push,
  ref,
  set,
  remove,
  get,
} from "firebase/database";
import { database, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail as sendPasswordResetEmailFirebase,
} from "firebase/auth";

const DB_MESSAGES_KEY = "messages";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newMessage, setNewMessage] = useState(""); // Define newMessage state
  const [isInputEnabled, setIsInputEnabled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChat, setShowChat] = useState(false); // Control visibility of the chat
  const [nickname, setNickname] = useState(""); // State for user's nickname

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
        // Retrieve the user's nickname from the database
        const userNicknameRef = ref(database, `users/${user.uid}/nickname`);
        const userNicknameSnapshot = await get(userNicknameRef);
        if (userNicknameSnapshot.exists()) {
          setNickname(userNicknameSnapshot.val());
        }

        setUser(user);
        setIsLoggedIn(true);
        setIsInputEnabled(true); // Enable input when user is authenticated
        setShowChat(true); // Show chat when user is authenticated
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setIsInputEnabled(false); // Disable input when user is not authenticated
        setShowChat(false); // Hide chat when user is not authenticated
      }
    });

    return () => {
      messagesAddedListener();
      messagesChangedListener();
      messagesRemovedListener();
      authStateChangedListener();
    };
  }, []);

  const handleLogin = async () => {
    try {
      // Check if email and password are provided
      if (!email || !password) {
        throw new Error("Error: Please type in your username and password.");
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Retrieve the user's nickname from the database
      const userNicknameRef = ref(database, `users/${user.uid}/nickname`);
      const userNicknameSnapshot = await get(userNicknameRef);
      if (userNicknameSnapshot.exists()) {
        setNickname(userNicknameSnapshot.val());
      }

      alert("You have signed in.");
    } catch (error) {
      alert("Error Wrong Username or Password was typed in.");
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("User signed out"); // Change to alert
    } catch (error) {
      alert("Error signing out: " + error.message); // Change to alert
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Set the user's nickname in the database
      const userNicknameRef = ref(database, `users/${user.uid}/nickname`);
      await set(userNicknameRef, nickname);

      alert("User signed up:", user);
    } catch (error) {
      alert("Error signing up:", error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email && password) {
      writeData();
    }
  };

  const writeData = () => {
    if (newMessage.trim() !== "") {
      const messageListRef = ref(database, DB_MESSAGES_KEY);
      const newMessageRef = push(messageListRef);
      const datetime = new Date().toLocaleString();
      set(newMessageRef, {
        message: newMessage,
        datetime,
        user: email,
      });
      setNewMessage("");
    }
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value); // Update newMessage state
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
    // Clear messages from the local state
    setMessages([]);

    // Clear messages from the Firebase Realtime Database
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    remove(messageListRef);
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmailFirebase(auth, email);
      alert("Password reset email sent to: " + email);
    } catch (error) {
      alert("Error sending password reset email:", error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Instagram Chat Rocket Academy Bootcamp</p>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            {showChat && (
              <>
                <div className="chat-container">
                  {messages.map((message, index) => (
                    <div
                      key={message.key}
                      className={`message ${
                        index % 2 === 0 ? "incoming" : "outgoing"
                      }`}
                    >
                      <button
                        className={`delete-button ${
                          index % 2 === 0 ? "incoming" : "outgoing"
                        }`}
                        onClick={() => handleDeleteMessage(message.key)}
                      >
                        X
                      </button>
                      <div className="message-content">{message.message}</div>
                      <div className="message-metadata">
                        <span className="datetime">{message.datetime}</span>
                        <span className="user">
                          {index % 2 === 0 ? nickname || email : password}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Enter a message"
                    disabled={!isInputEnabled}
                  />
                  <button type="submit" disabled={!isInputEnabled}>
                    Send
                  </button>
                  <br />
                </form>
                <button onClick={handleClearLog}>Clear Log</button>
              </>
            )}
          </>
        ) : (
          <>
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter Email"
            />
            <input
              type="text"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter Password"
            />
            <br />
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter Nickname"
            />
            <br />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignup}>Sign Up</button>
            <button
              onClick={handleResetPassword}
              disabled={!email} // Disable reset password if email is empty
            >
              Forget Password
            </button>
          </>
        )}
      </header>
    </div>
  );
};

export default App;
