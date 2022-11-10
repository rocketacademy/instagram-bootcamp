import React from "react";
import Card from "react-bootstrap/Card";
import { onChildAdded, push, ref as databaseref, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database } from "./firebase";
import { storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";
const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

class UploadPhoto extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
      messages: [],
      messageInput: "",
      fileInputValue: "",
      fileInputFile: null,
    };
  }

  componentDidMount() {
    const messagesRef = databaseref(database, MESSAGE_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
    const postsRef = databaseref(database, POSTS_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      console.log(data);
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store post key so we can use it as a key in our list items when rendering posts
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }
  handleChange = (event) => {
    this.setState({
      messageInput: event.target.value,
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  // writeData = () => {
  //   const messageListRef = ref(database, MESSAGE_FOLDER_NAME);
  //   const newMessageRef = push(messageListRef);
  //   set(newMessageRef, "abc");
  // };

  // handleSubmit = () => {
  //   const messageListRef = databaseref(database, MESSAGE_FOLDER_NAME);
  //   const newMessageRef = push(messageListRef);
  //   set(newMessageRef, this.state.messageInput);
  // };

  handleFileInputChange = (event) => {
    console.log(event);
    this.setState({
      fileInputFile: event.target.files[0],
      fileInputValue: event.target.value,
    });
  };

  handleTextInputChange = (event) => {
    this.setState({ textInputValue: event.target.value });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  handleSubmit = (event) => {
    // Prevent default form submit behaviour that will reload the page
    event.preventDefault();

    // Store images in an images folder in Firebase Storage
    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${this.state.fileInputFile.name}`
    );

    // Upload file, save file download URL in database with post text
    uploadBytes(fileRef, this.state.fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const postListRef = databaseref(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadUrl,
          // text: this.state.textInputValue,
        });
        // Reset input field after submit
        this.setState({
          fileInputFile: null,
          fileInputValue: "",
          textInputValue: "",
        });
      });
    });
  };
  render() {
    let postCards = this.state.posts.map((post) => (
      <Card bg="dark" key={post.key}>
        <Card.Img src={post.val.imageLink} className="Card-Img" />
        <Card.Text>{post.val.text}</Card.Text>
      </Card>
    ));
    // Convert messages in state to message JSX elements to render
    // let messageListItems = this.state.messages.map((message) => (
    //   <li key={message.key}>{message.val}</li>
    // ));
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="file"
          value={this.state.fileInputValue}
          onChange={this.handleFileInputChange}
        />
        <input type="submit"></input>
      </form>
    );
  }
}

export default UploadPhoto;
