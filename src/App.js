import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "./firebase";
import {
  ref as storeRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORE_FILES_KEY = "files";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      messageInput: "",
      fileInput: null,
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

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  // writeData = () => {
  //   const messageListRef = ref(database, DB_MESSAGES_KEY);
  //   const newMessageRef = push(messageListRef);
  //   set(newMessageRef, "abc");
  // };

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({
      messageInput: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    const fileRef = storeRef(
      storage,
      `${STORE_FILES_KEY}/${this.state.fileInput.name}`
    );

    // Trying to add date (unsuccessfully)
    // const newMessageRef = push(messageListRef);
    // console.log("newMessageRef: ", newMessageRef);
    const timestamp = new Date();
    console.log(timestamp.toLocaleString("en-GB").slice(0, -3));

    uploadBytesResumable(fileRef, this.state.fileInput).then(() => {
      getDownloadURL(fileRef).then((url) => {
        const newMessage = {
          message: this.state.messageInput,
          timestamp: timestamp.toLocaleString("en-GB").slice(0, -3),
          file: url,
        };
        set(newMessageRef, newMessage).then(() => {
          this.setState({ messageInput: "", fileInput: null });
        });
      });
    });

    // push(messageListRef, newMessage);
  };

  handleFileChange = (e) => {
    this.setState({
      fileInput: e.target.files[0],
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <div>
        <li key={message.key}>
          {message.val.message} {message.val.timestamp}
        </li>
        <img
          src={message.val.file}
          alt="beautiful sunset"
          width="50vw"
          height="30vh"
        />
      </div>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              value={this.state.messageInput}
              placeholder="Type something..."
              onChange={this.handleChange}
            />
            <input type="submit" value="➤" />
            <br />
            <input
              id="fileInput"
              type="file"
              onChange={this.handleFileChange}
            />

            {/* <button onClick={this.writeData}>Send</button> */}
          </form>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
