import { useState, useEffect, useRef } from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

function App() {
  // Initialise empty messages array in state to keep local state in sync with Firebase
  // When Firebase changes, update local state, which will update local UI
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const messagesRef = useRef(ref(database, DB_MESSAGES_KEY));

  useEffect(() => {
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef.current, (data) => {
      const { message, timestamp } = data.val();
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages((prevMessages) =>
        // Store message key so we can use it as a key in our list items when rendering messages
        [
          ...prevMessages,
          {
            key: data.key,
            message,
            timestamp: new Date(timestamp),
          },
        ]
      );
    });
  }, []);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = () => {
    const newMessageRef = push(messagesRef.current);
    const timestamp = new Date().toISOString();
    set(newMessageRef, { message: input, timestamp }).then(() =>
      console.log("Set successful")
    );
  };

  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message) => (
    <li key={message.key}>
      {message.message}{" "}
      <span className="timestamp">
        {message.timestamp.toLocaleString("en-SG")}
      </span>
    </li>
  ));

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <form onSubmit={handleSubmit}>
          <input type="text" value={input} onChange={handleInputChange} />
          <br />
          <button type="submit">Send</button>
        </form>
        <ol>{messageListItems}</ol>
      </header>
    </div>
  );
}

export default App;
