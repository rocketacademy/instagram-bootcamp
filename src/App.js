import React from "react";
import { get, onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "./firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
// import logo from "./logo.png";
import "./App.css";

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
      inputValue: "",
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
  handleChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      text: this.state.inputValue,
      date: new Date().toLocaleDateString(undefined, {
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }),
      url: url,
    });
    this.setState({ inputValue: "" });
  };
  submit = () => {
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
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>
        <span>{message.val.text}</span>
        <span className="date">{message.val.date}</span>
        <p>
          {message.val.url ? (
            <img src={message.val.url} alt={message.val.name} />
          ) : (
            "No image"
          )}
        </p>
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          {/* TODO: Add input field and add text input as messages in Firebase */}

          <input
            type="text"
            name="text"
            value={this.state.inputValue}
            onChange={this.handleChange}
          />
          <input
            type="file"
            name="file"
            value={this.state.fileInputValue}
            onChange={(e) => {
              this.setState({
                fileInputFile: e.target.files[0],
                fileInputValue: e.target.files.name,
              });
            }}
          ></input>

          <button onClick={this.submit}>Send</button>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
