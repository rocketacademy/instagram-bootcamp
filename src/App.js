import React from "react";
import {
  onChildAdded,
  push,
  ref as realTimeDatabaseRef,
  set,
} from "firebase/database";
import { realTimeDatabase, storage } from "./firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import logo from "./logo.png";
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
      name: "",
      messageInput: "",
      nameInput: "",
      fileInputFile: { name: "" },
      fileInputValue: "",
    };
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  componentDidMount() {
    const messagesRef = realTimeDatabaseRef(realTimeDatabase, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  handleMessageChange = (event) => {
    this.setState({ messageInput: event.target.value });
  };

  handleNameChange = (event) => {
    this.setState({ nameInput: event.target.value });
  };

  handleNameSubmit = (event) => {
    event.preventDefault();

    this.setState({ name: this.state.nameInput });
  };

  writeData = (url) => {
    const PostRef = realTimeDatabaseRef(realTimeDatabase, DB_MESSAGES_KEY);
    const newPostRef = push(PostRef);

    set(newPostRef, {
      name: this.state.name,
      message: this.state.messageInput,
      dateTime: new Date().toLocaleString(),
      url: url,
    });

    this.setState({
      messageInput: "",
      fileInputFile: { name: "" },
      fileInputValue: "",
    });
  };

  handlePostSubmit = (e) => {
    e.preventDefault();

    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );

    this.state.fileInputFile.name !== ""
      ? uploadBytes(fullStorageRef, this.state.fileInputFile).then(
          (snapshot) => {
            getDownloadURL(fullStorageRef, this.state.fileInputFile.name).then(
              (url) => {
                this.writeData(url);
              }
            );
          }
        )
      : this.writeData("");
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <div>
        <li key={message.key}>
          {/* Render each part of message in separate lines */}
          <span>Name: {message.val.name}</span>
          <br />
          <span>Message: {message.val.message}</span>
          <br />
          <span>DateTime: {message.val.dateTime}</span>
          <br />
          {message.val.url ? (
            <img
              className="postImage"
              src={message.val.url}
              alt={message.val.name}
            />
          ) : (
            <p>No images</p>
          )}
        </li>
        <br />
      </div>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          {/* Prompt user to enter name */}
          {this.state.name === "" && (
            <div>
              <h3>How do we address you?</h3>
              <form onSubmit={this.handleNameSubmit}>
                <label>
                  <input
                    type="text"
                    value={this.state.nameInput}
                    onChange={this.handleNameChange}
                  />{" "}
                  <input type="submit" value="Enter" />
                </label>
              </form>
            </div>
          )}

          {this.state.name !== "" && (
            <div>
              <h3>Message</h3>
              <form onSubmit={this.handlePostSubmit}>
                {/* message input */}
                <input
                  type="text"
                  value={this.state.messageInput}
                  onChange={this.handleMessageChange}
                />{" "}
                <br />
                <br />
                <div className="inputContainer">
                  <label>
                    {this.state.fileInputFile.name !== ""
                      ? "Change Photo"
                      : "Select Photo"}{" "}
                    <br />
                    <br />
                    <i class="fa fa-2x fa-camera"></i>
                    <input
                      className="inputTag"
                      type="file"
                      accept="image/png, image/jpg, image/gif, image/jpeg"
                      // Set state's fileInputValue to "" after submit to reset file input
                      value={this.state.fileInputValue}
                      onChange={(e) =>
                        // e.target.files is a FileList object that is an array of File objects
                        // e.target.files[0] is a File object that Firebase Storage can upload
                        this.setState({
                          fileInputFile: e.target.files[0],
                          fileInputValue: e.target.file,
                        })
                      }
                    />
                    <br />
                  </label>
                </div>
                <br />
                {this.state.fileInputFile.name !== ""
                  ? `Photo selected: ${this.state.fileInputFile.name}`
                  : "No file selected"}
                <br />
                <br />
                <input type="submit" value="Post" />
              </form>
              <br />
              <ol>{messageListItems}</ol>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
