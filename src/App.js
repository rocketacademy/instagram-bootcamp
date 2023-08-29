import { useState, useEffect, useRef } from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "./firebase";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

function App() {
  // Initialise empty messages array in state to keep local state in sync with Firebase
  // When Firebase changes, update local state, which will update local UI
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const messagesRef = useRef(databaseRef(database, DB_MESSAGES_KEY));

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

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    console.log(newFile);
    setFile(newFile);
  };

  const handleSubmit = () => {
    const newMessageRef = push(messagesRef.current);
    const timestamp = new Date().toISOString();

    const newFileRef = storageRef(storage, "files/${file.name}");

    uploadBytes(newFileRef, file)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => console.log(url));

    set(newMessageRef, { message, timestamp }).then(() =>
      console.log("Set message successful")
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
        <h1>Rocketgram</h1>
        <form onSubmit={handleSubmit}>
          <p>
            Enter message{" "}
            <input type="text" value={message} onChange={handleMessageChange} />
          </p>
          <p>
            <input type="file" onChange={handleFileChange} />
          </p>
          <p>
            <button type="submit">Send</button>
          </p>
        </form>
        <ol>{messageListItems}</ol>
      </header>
    </div>
  );
}

export default App;
