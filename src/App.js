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
      userInput: "",
      fileInputFile: null,
      fileInputValue: "",
      imageURL: "",
    };
  }

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
  writeData = (event) => {
    event.preventDefault();
    const fileDetails = this.state.fileInputFile;
    const imageReference = storageRef(storage, `images/${fileDetails.name}`);

    uploadBytes(imageReference, this.state.fileInputFile).then(
      getDownloadURL(imageReference)
        .then((url) => {
          const messageListRef = databaseRef(database, MESSAGE_FOLDER_NAME);
          const newMessageRef = push(messageListRef);

          set(newMessageRef, {
            userMessage: this.state.userInput,
            imageURL: url,
            date: Date(),
          });

          this.setState({ userInput: "", fileInputValue: "" });
        })
        .catch((error) => {
          console.log(error);
        })
    );
  };

  handleChange = (event) => {
    this.setState({
      userInput: event.target.value,
    });
  };

  onFileChange = (event) => {
    this.setState({
      fileInputFile: event.target.files[0],
      fileInputValue: event.target.value,
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>
        <img
          className="user-image"
          src={message.val.imageURL}
          alt={message.val.userMessage}
        />
        {message.val.userMessage}
        {new Date(message.val.date).toLocaleString()}
      </li>
    ));

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* TODO: Add input field and add text input as messages in Firebase */}
        </header>
        <body>
          <ul>{messageListItems}</ul>
          <form>
            <label>Upload a Photo: </label>
            <input
              id="post-picture"
              name="post-picture"
              type="file"
              accept="image/png, image/jpeg"
              onChange={this.onFileChange}
              value={this.state.fileInputValue}
            />
            <input onChange={this.handleChange} value={this.state.userInput} />
            <button type="submit" onClick={this.writeData}>
              Send
            </button>
          </form>
        </body>
      </div>
    );
  }
}

export default App;
