import React from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.textInputValue) return; // skip the rest of code if user didn't type anything

    this.writeData();
    this.setState(() => ({ textInputValue: "" }));
  };

  componentDidMount() {
    const messagesRef = databaseRef(database, MESSAGE_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const messageListRef = databaseRef(database, MESSAGE_FOLDER_NAME);
    const newMessageRef = push(messageListRef);
    let stringToSave =
      new Date().toLocaleString() + "<>" + this.state.textInputValue;
    set(newMessageRef, stringToSave);
  };

  writeFile = () => {
    // Create a reference to the image file
    const imagesRef = storageRef(storage, this.state.fileInputFile);
    const metadata = { contentType: "image/jpeg" };

    // Upload the file and metadata
    //const uploadTask = uploadBytes(imagesRef, file, metadata);
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>
        {message.val.split("<>")[0]} →→→ {message.val.split("<>")[1]}
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p> Choose file, input message and click [Send] button.</p>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form>
            {/* File input example */}
            <input
              type="file"
              // Set state's fileInputValue to "" after submit to reset file input
              value={this.state.fileInputValue}
              onChange={(e) =>
                // e.target.files is a FileList object that is an array of File objects
                // e.target.files[0] is a File object that Firebase Storage can upload
                this.setState({ fileInputFile: e.target.files[0] })
              }
            />
            {/* Text input example */}
            <input
              type="text"
              value={this.state.textInputValue}
              onChange={(e) =>
                this.setState({ textInputValue: e.target.value })
              }
            />
            <button onClick={this.handleSubmit}>Send</button>
          </form>
          <ul>{messageListItems}</ul>
        </header>
      </div>
    );
  }
}

export default App;
