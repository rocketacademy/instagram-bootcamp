import React from "react";
import { onChildAdded, push, ref as dbRef, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "./firebase.js";
import logo from "./logo.png";
import "./App.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_IMAGES_KEY = "images";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      message: "",
      timestamp: "",
      fileName: "",
      fileInput: null,
    };
  }

  componentDidMount() {
    const messagesRef = dbRef(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [
          ...state.messages,
          {
            key: data.key,
            message: data.val().message,
            timestamp: data.val().timestamp,
            fileDownloadURL: data.val().fileDownloadURL,
          },
        ],
      }));
    });
  }

  // promisedSetState = (newState) =>
  //   new Promise((resolve) => this.setState(newState, resolve));

  uploadFile = () => {
    console.log("intended step 3");
    const fileRef = storageRef(
      storage,
      `${STORAGE_IMAGES_KEY}/${this.state.fileName}`
    );
    return uploadBytesResumable(fileRef, this.state.fileInput)
      .then((snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Step 3 - Upload is " + progress + "% done");
      })
      .then(() => getDownloadURL(fileRef))
      .catch((error) => {
        console.log(error);
      });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    console.log("intended step 4");
    const messageListRef = dbRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    return set(newMessageRef, {
      message: this.state.message,
      timestamp: this.state.timestamp,
      fileDownloadURL: url,
    });
  };

  renderMessageItems = () => {
    let messageListItems = this.state.messages.map((item) => (
      <Card key={item.key}>
        <Card.Img
          variant="top"
          key={`${item.key}-img`}
          src={item.fileDownloadURL}
          alt={item.message}
        />
        <Card.Text key={`${item.key}-ts`} className="message">
          {item.message}
        </Card.Text>
        <Card.Footer key={`${item.key}-m`} className="timestamp">
          {item.timestamp}
        </Card.Footer>
      </Card>
    ));
    return messageListItems;
  };

  handleTextChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (e) => {
    this.setState({
      fileInput: e.target.files[0],
      fileName: e.target.file, // try w/o [0].name
    });
  };

  handleSubmit = (e) => {
    console.log("intended step 1");
    e.preventDefault();
    if (this.state.message.length === 0 || !this.state.fileInput) {
      alert("Upload something and write a message!");
      return;
    }
    new Promise((resolve) => {
      console.log("intended step 2");
      this.setState({ timestamp: new Date().toLocaleString("en-GB") }, resolve);
    })
      .then(this.uploadFile)
      .then(this.writeData)
      .then(() => {
        console.log("intended step 5");
        this.setState({
          message: "",
          timestamp: "",
          fileName: "",
          fileInput: null,
        });
      });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Form onSubmit={this.handleSubmit}>
            <Form.Control
              type="file"
              value={this.state.fileName}
              onChange={this.handleFileChange}
            />
            <Form.Control
              name="message"
              id="message"
              placeholder="Write your message here!"
              value={this.state.message}
              onChange={this.handleTextChange}
            />
            <Button variant="light" type="submit">
              Post
            </Button>
          </Form>
          {this.state.messages.length > 0 && (
            <div className="container">{this.renderMessageItems()}</div>
          )}
        </header>
      </div>
    );
  }
}
