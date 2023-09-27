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
} from "firebase/database";
import { database } from "./firebase";

const DB_MESSAGES_KEY = "messages";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [incomingUsername, setIncomingUsername] = useState("");
  const [outgoingUsername, setOutgoingUsername] = useState("");
  const [isInputEnabled, setIsInputEnabled] = useState(false);

  useEffect(() => {
    if (incomingUsername && outgoingUsername) {
      setIsInputEnabled(true);
    } else {
      setIsInputEnabled(false);
    }
  }, [incomingUsername, outgoingUsername]);

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

    return () => {
      messagesAddedListener();
      messagesChangedListener();
      messagesRemovedListener();
    };
  }, []);

  const writeData = () => {
    if (newMessage.trim() !== "") {
      const messageListRef = ref(database, DB_MESSAGES_KEY);
      const newMessageRef = push(messageListRef);
      const datetime = new Date().toLocaleString();
      set(newMessageRef, {
        message: newMessage,
        datetime,
        user: incomingUsername,
      });
      setNewMessage("");
    }
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleIncomingUsernameChange = (event) => {
    setIncomingUsername(event.target.value);
  };

  const handleOutgoingUsernameChange = (event) => {
    setOutgoingUsername(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (incomingUsername && outgoingUsername) {
      writeData();
    }
  };

  const handleDeleteMessage = (messageKey) => {
    const messageRef = ref(database, `${DB_MESSAGES_KEY}/${messageKey}`);
    remove(messageRef);
  };

  const handleClearLog = () => {
    // Clear all messages
    setMessages([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Instagram Chat Rocket Academy Bootcamp</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={incomingUsername}
            onChange={handleIncomingUsernameChange}
            placeholder="Enter incoming username"
          />
          <br />
          <input
            type="text"
            value={outgoingUsername}
            onChange={handleOutgoingUsernameChange}
            placeholder="Enter outgoing username"
          />
          <br />
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Enter a message"
            disabled={!isInputEnabled}
          />
          <br />
          <button type="submit" disabled={!isInputEnabled}>
            Send
          </button>
          <button type="button" onClick={handleClearLog}>
            Clear Log
          </button>
        </form>

        <div className="chat-container">
          {messages.map((message, index) => (
            <div
              key={message.key}
              className={`message ${index % 2 === 0 ? "incoming" : "outgoing"}`}
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
                  {index % 2 === 0 ? incomingUsername : outgoingUsername}
                </span>
              </div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
};

export default App;
