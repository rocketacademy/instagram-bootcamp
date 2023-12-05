import React from "react";
import Button from "react-bootstrap/Button";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "./firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

class Post extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      textInputValue: "",
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
    this.setState({ [event.target.name]: event.target.value });
  };

  writeData = (url) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, { text: this.state.textInputValue, url: url, likes: 0 });
    // Reset input field after submit
    this.setState({
      textInputValue: "",
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
  };

  render() {
    // Convert messages in state to message JSX elements to render

    let messageListItems = this.state.messages.map((message) => (
      <Card bg="dark" text="white" key={message.key}>
        {message.val.url ? (
          <Card.Img className="image" src={message.val.url} alt="image" />
        ) : (
          <Card.Text>"No images"</Card.Text>
        )}
        <Card.Body>
          <Card.Text>{message.val.text}</Card.Text>
          <Button onSubmit={this.handleLikes}>Likes</Button>
        </Card.Body>
      </Card>
    ));

    return (
      <div className="App-header">
        <br />
        <form onSubmit={this.handleSubmit} className="input">
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              type="file"
              value={this.state.fileInputValue}
              onChange={(e) =>
                this.setState({
                  fileInputFile: e.target.files[0],
                  fileInputValue: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Control
            type="text"
            placeholder="Description"
            value={this.state.textInputValue}
            onChange={this.handleChange}
          />

          <Button
            variant="light"
            type="submit"
            // Disable Upload button when text input is empty
            disabled={!this.state.textInputValue}
          >
            Upload
          </Button>
        </form>
        <div className="grid">{messageListItems.reverse()}</div>
      </div>
    );
  }
}

export default Post;
