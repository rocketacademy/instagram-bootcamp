import React, { useState, useEffect } from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesRef = ref(database, MESSAGE_FOLDER_NAME);
  useEffect(() => {
    // onChildAdded will return data for every child at the reference and every subsequent new child
    const msg = [];
    onChildAdded(messagesRef, (data) => {
      msg.push({ key: data.key, val: data.val() });
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages([...msg]);
    });
  }, []);
  // Note use of array fields syntax to avoid having to manually bind this method to the class

  const messageListItems = messages.map((message) => (
    <li key={message.key}>{message.val}</li>
  ));

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageListRef = ref(database, MESSAGE_FOLDER_NAME);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, input);
    setInput("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br></br>
        <form onSubmit={handleSubmit}>
          <label for="message">
            To start communicating, type a message inside the input field!
          </label>
          <br></br>
          <input
            type="text"
            id="message"
            required
            onChange={handleChange}
          ></input>
          <input type="submit" value="Send" disabled={!input}></input>
        </form>
        <ol>{messageListItems}</ol>
      </header>
    </div>
  );
};

export default App;
