import React, { useEffect, useState } from "react";
import "./App.css";
import { ref, push, set, onValue } from "firebase/database";
import { database } from "./firebase";

const DB_MESSAGES_KEY = "messages";

function App() {
  const [messages, setMessages] = useState([]);
  const [textInputValue, setTextInputValue] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data
        ? Object.keys(data).map((key) => ({ key, val: data[key] }))
        : [];
      setMessages(loadedMessages);
    });
  }, []);

  const handleChange = (e) => {
    setTextInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      text: textInputValue,
      timestamp: Date.now(),
    });
    setTextInputValue("");
  };

  const messageListItems = messages.map((message) => (
    <li className="message-item" key={message.key}>
      {message.val.text}{" "}
      <span className="timestamp">
        {new Date(message.val.timestamp).toLocaleString()}
      </span>
    </li>
  ));

  return (
    <div className="App">
      <header className="App-header">
        <h1>RocketChat To Yourself 🙊</h1>
        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            className="chat-input"
            type="text"
            value={textInputValue}
            onChange={handleChange}
          />

          <input
            className="chat-send"
            type="submit"
            value="Send"
            disabled={!textInputValue}
          />
        </form>
        <ul className="chat-messages">{messageListItems}</ul>
      </header>
    </div>
  );
}

export default App;
