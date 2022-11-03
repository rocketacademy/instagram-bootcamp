import React from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "./firebase";
import Card from "react-bootstrap/Card";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";
const IMAGES_FOLDER_NAME = "images";

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
  }

  handleTextInputChange = (event) => {
    this.setState({ textInputValue: event.target.value });
  };

  handleFileInputChange = (event) => {
    this.setState({
      fileInputFile: event.target.files[0],
      fileInputValue: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.textInputValue) return; // skip the rest of code if user didn't type anything

    // Store images in an images folder in Firebase Storage
    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${this.state.fileInputFile.name}`
    );

    // Upload file, save file download URL in database with post text
    uploadBytes(fileRef, this.state.fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const messageListRef = databaseRef(database, MESSAGE_FOLDER_NAME);
        const newMessageRef = push(messageListRef);
        set(newMessageRef, {
          imageLink: downloadUrl,
          createdAt: new Date().toLocaleString(),
          text: this.state.textInputValue,
        });
        // Reset input field after submit
        this.setState({
          fileInputFile: null,
          fileInputValue: "",
          textInputValue: "",
        });
      });
    });

    //this.writeData();
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

  render() {
    let messageListItems = this.state.messages.map((message) => (
      <Card key={message.key}>
        <Card.Img
          className="storage-image"
          src={message.val.imageLink}
          alt="image"
        />
        <Card.Text>
          {message.val.createdAt} →→→ {message.val.text}
        </Card.Text>
      </Card>
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
              onChange={this.handleFileInputChange}
            />
            {/* Text input example */}
            <input
              type="text"
              value={this.state.textInputValue}
              onChange={this.handleTextInputChange}
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
