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
import Card from "react-bootstrap/Card";

const MESSAGE_FOLDER_NAME = "messages";
const IMAGES_FOLDER_NAME = "images";

class Posts extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      inputTextValue: "",
      fileInputFile: null,
      fileInputValue: "",
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

  // **insert handleChange for the input fileupload here**
  handleFileInputChange = (e) => {
    this.setState({
      fileInputFile: e.target.files[0],
      fileInputValue: e.target.value,
    });
  };

  // **insert handleChange for the input textfield here**
  handleTextInputChange = (e) => {
    this.setState({
      inputTextValue: e.target.value,
    });
  };

  // **insert handleSubmit here for what happens when click send**
  handleSubmit = (event) => {
    event.preventDefault();

    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${this.state.fileInputFile.name}`
    );

    uploadBytes(fileRef, this.state.fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const messagesListRef = databaseRef(database, MESSAGE_FOLDER_NAME);
        const newMessagesRef = push(messagesListRef);
        set(newMessagesRef, {
          imageLink: downloadUrl,
          text: this.state.inputTextValue,
        });
        this.setState({
          fileInputFile: null,
          fileInputValue: "",
          inputTextValue: "",
        });
      });
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <Card key={message.key}>
        <Card.Img
          variant="top"
          src={message.val.imageLink}
          style={{ width: "50vw", height: "30vh" }}
        />
        <Card.Text>{message.val.text}</Card.Text>
      </Card>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form onSubmit={this.handleSubmit}>
            <label>
              Upload:
              <input
                type="file"
                value={this.state.fileInputValue}
                onChange={this.handleFileInputChange}
              />
            </label>
            <br />
            <label>
              Title:
              <input
                type="text"
                value={this.state.inputTextValue}
                onChange={this.handleTextInputChange}
              />
            </label>
            <input type="submit" value="Upload!" />
          </form>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default Posts;
