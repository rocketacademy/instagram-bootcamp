import React from "react";
import {
  onChildAdded,
  push,
  ref as dbRef,
  set,
  onValue,
  update,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../firebase.js";
import logo from "../logo.png";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import MainForm from "./Form.js";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_IMAGES_KEY = "images";

export default class MainFeed extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.inputRef = React.createRef();
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
            likes: data.val().likes,
            liked: false,
          },
        ],
      }));
    });
  }

  uploadFile = () => {
    const fileRef = storageRef(
      storage,
      `${STORAGE_IMAGES_KEY}/${this.state.fileName}`
    );
    return uploadBytesResumable(fileRef, this.state.fileInput)
      .then((snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      })
      .then(() => getDownloadURL(fileRef))
      .catch((error) => {
        console.log(error);
      });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    const messageListRef = dbRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    return set(newMessageRef, {
      message: this.state.message,
      timestamp: this.state.timestamp,
      fileDownloadURL: url,
      likes: 0,
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
        <Card.Text key={`${item.key}-m`} className="message">
          {item.message}
        </Card.Text>
        <Card.Footer key={`${item.key}-ft`}>
          <div key={`${item.key}-ts`} className="timestamp">
            {item.timestamp}
          </div>
          <div className="like-item">
            <div id="likes">{item.likes}</div>
            <Button name={item.key} variant="dark" onClick={this.handleLike}>
              ♥
            </Button>
          </div>
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
    console.log(e.target.files[0]);
    console.log(e.target.files[0].name);
    this.setState({
      fileInput: e.target.files[0],
      fileName: e.target.files[0].name,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.message.length === 0 || !this.state.fileInput) {
      alert("Upload something and write a message!");
      return;
    }
    new Promise((resolve) => {
      this.setState({ timestamp: new Date().toLocaleString("en-GB") }, resolve);
    })
      .then(this.uploadFile)
      .then(this.writeData)
      .then(() => {
        this.setState({
          message: "",
          timestamp: "",
          fileName: "",
          fileInput: null,
        });
        this.inputRef.current.value = "";
      });
  };

  handleLike = (e) => {
    let currentLikes;
    const messagesToUpdate = [...this.state.messages];
    const indexOfLiked = messagesToUpdate
      .map((message) => message.key)
      .indexOf(e.target.name);
    const likedMessageRef = dbRef(
      database,
      `${DB_MESSAGES_KEY}/${e.target.name}`
    );
    onValue(likedMessageRef, (snapshot) => {
      currentLikes = snapshot.val().likes;
    });
    if (!this.state.messages[indexOfLiked].liked) {
      update(likedMessageRef, { likes: parseInt(currentLikes) + 1 });
      messagesToUpdate[indexOfLiked].likes += 1;
      messagesToUpdate[indexOfLiked].liked = true;
    } else {
      update(likedMessageRef, { likes: parseInt(currentLikes) - 1 });
      messagesToUpdate[indexOfLiked].likes -= 1;
      messagesToUpdate[indexOfLiked].liked = false;
    }
    this.setState({ messages: messagesToUpdate });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <MainForm
            handleFileChange={this.handleFileChange}
            handleTextChange={this.handleTextChange}
            message={this.state.message}
            inputRef={this.inputRef}
            handleSubmit={this.handleSubmit}
          />
          {this.state.messages.length > 0 && (
            <div className="container">{this.renderMessageItems()}</div>
          )}
        </header>
      </div>
    );
  }
}
