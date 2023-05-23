import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      textInputValue: "",
      date: "",
      time: "",
      fileInputFile: null,
      fileInputValue: "",
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  handleChange = (event) => {
    this.setState({ textInputValue: event.target.value });
  };

  writeData = (url) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: this.state.textInputValue,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      url: url,
    });
    this.setState({
      message: "",
      date: "",
      time: "",
      fileInputFile: null,
      fileInputValue: "",
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  handleSubmit = (event) => {
    event.preventDefault();
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );

    uploadBytes(fullStorageRef, this.state.fileInputFile).then((snapshot) => {
      getDownloadURL(fullStorageRef, this.state.fileInputFile.name).then(
        (url) => {
          this.writeData(url);
        }
      );
    });

    // Reset input field after submit
    this.setState({ textInputValue: "" });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>
        Message: {message.val.message} <br />
        Date:{message.val.date} - {message.val.time}
        {message.val.url ? (
          <img src={message.val.url} alt={message.val.message} />
        ) : (
          <p>No images</p>
        )}
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              value={this.state.textInputValue}
              onChange={this.handleChange}
            />
            <input
              type="submit"
              value="Send"
              // Disable Send button when text input is empty
              disabled={!this.state.textInputValue}
            />
            <input
              type="file"
              name="file"
              value={this.state.fileInputValue}
              onChange={(e) => {
                this.setState({
                  fileInputFile: e.target.files[0],
                  fileInputValue: e.target.file,
                });
              }}
            />
          </form>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
