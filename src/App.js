// Import necessary modules and functions
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

// Key for messages in the database
const DB_MESSAGES_KEY = "messages";

// Define the main component
const App = () => {
  // State variables to manage different aspects of the app
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isInputEnabled, setIsInputEnabled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isNicknameSet, setIsNicknameSet] = useState(false);

  // Assuming you have the UID of the current user
  const currentUserUID = "uid_of_current_user"; // Replace this with the actual UID

  // Effect hook to handle component mounting and unmounting
  useEffect(() => {
    // Firebase database reference for messages
    const messagesRef = ref(database, DB_MESSAGES_KEY);

    // Event listeners for database changes
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
        const userNicknameRef = ref(database, `users/${user.uid}/nickname`);
        const userNicknameSnapshot = await get(userNicknameRef);
        if (userNicknameSnapshot.exists()) {
          setNickname(userNicknameSnapshot.val());
          setIsNicknameSet(true);
        }

        setUser(user);
        setIsLoggedIn(true);
        setIsInputEnabled(true);
        // Removed setShowChat as it was not being used
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setIsInputEnabled(false);
        // Removed setShowChat as it was not being used
      }
    });

    // Clean up event listeners on component unmount
    return () => {
      messagesAddedListener();
      messagesChangedListener();
      messagesRemovedListener();
      authStateChangedListener();
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  // Handler for user signup
  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userNicknameRef = ref(database, `users/${user.uid}/nickname`);
      await set(userNicknameRef, nickname);

      setIsNicknameSet(true);

      alert("User signed up:", user);
    } catch (error) {
      alert("Error signing up:", error.message);
    }
  };

  // Handler for user login
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        throw new Error("Error: Please type in your username and password.");
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userNicknameRef = ref(database, `users/${user.uid}/nickname`);
      const userNicknameSnapshot = await get(userNicknameRef);
      if (userNicknameSnapshot.exists()) {
        setNickname(userNicknameSnapshot.val());
        setIsNicknameSet(true);
      }

      alert("You have signed in.");
    } catch (error) {
      alert("Error Wrong Username or Password was typed in.");
    }
  };

  // Handler to enable nickname editing
  const handleNicknameEdit = () => {
    setIsNicknameSet(false);
  };

  // Handler to save edited nickname
  const handleNicknameSave = () => {
    setIsNicknameSet(true);

    // Save the nickname to the database
    const userNicknameRef = ref(database, `users/${user.uid}/nickname`);
    set(userNicknameRef, nickname);
  };

  // Handler for message submission
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
          user: currentUserUID, // Modified to use currentUserUID
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error writing message:", error);
      }
    }
  };

  // Handler for input change in the new message input field
  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  // Handler for input change in the email input field
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Handler for input change in the password input field
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Handler to delete a message
  const handleDeleteMessage = (messageKey) => {
    const messageRef = ref(database, `${DB_MESSAGES_KEY}/${messageKey}`);
    remove(messageRef);
  };

  // Handler to clear the message log
  const handleClearLog = () => {
    setMessages([]);

    const messageListRef = ref(database, DB_MESSAGES_KEY);
    remove(messageListRef);
  };

  // Handler to log out the user
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("User signed out");
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  };

  // Handler to send a password reset email
  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmailFirebase(auth, email);
      alert("Password reset email sent to: " + email);
    } catch (error) {
      alert("Error sending password reset email:", error.message);
    }
  };

  // Handler to edit a message
  const handleEditMessage = (messageKey, editedMessage) => {
    const messageRef = ref(
      database,
      `${DB_MESSAGES_KEY}/${messageKey}/message`
    );
    set(messageRef, editedMessage);
  };

  // Render the main component
  return (
    <div className="App">
      <header className="App-header">
        <p>Instagram Chat Rocket Academy Bootcamp</p>
        <div>
          {isLoggedIn ? (
            <>
              {isNicknameSet ? (
                <>
                  <button onClick={handleLogout}>Logout</button>
                  <button onClick={handleNicknameEdit}>
                    Edit Nickname
                  </button>{" "}
                  {/* Moved here */}
                  <div className="chat-container">
                    {messages.map((message, index) => (
                      <div
                        key={message.key}
                        className={`message ${
                          message.user === currentUserUID
                            ? "outgoing"
                            : "incoming"
                        }`}
                      >
                        <div className="message-buttons">
                          <button
                            className="edit-button"
                            onClick={() => {
                              const editedMessage = prompt(
                                "Edit message:",
                                message.message
                              );
                              if (editedMessage !== null) {
                                handleEditMessage(message.key, editedMessage);
                              }
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteMessage(message.key)}
                          >
                            ❌
                          </button>
                        </div>
                        <div className="message-content">
                          {message.message}
                          <br />
                          <span className="message-metadata">
                            {message.datetime}
                            &nbsp;
                            {message.user === currentUserUID
                              ? nickname || email
                              : "Other User"}
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
              ) : (
                <>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter Nickname"
                  />
                  <button onClick={handleNicknameSave}>Set Nickname</button>
                </>
              )}
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
          )}
        </div>
      </header>
    </div>
  );
};

export default App;
