import React from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import Card from "react-bootstrap/Card";
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save Firebase folder names as constants to avoid bugs due to misspelling
const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty posts array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
    };
  }

  componentDidMount() {
    const postsRef = databaseRef(database, POSTS_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store post key so we can use it as a key in our list items when rendering posts
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  handleFileInputChange = (event) => {
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
    event.preventDefault();

    // Store images in an images folder in Firebase Storage
    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${this.state.fileInputFile.name}`
    );

    // Upload file, save file download URL in database with post text
    uploadBytes(fileRef, this.state.fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadUrl,
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
  };

  render() {
    // Convert posts in state to post JSX elements to render
    let postCards = this.state.posts.map((post) => (
      <Card key={post.key}>
        <Card.Img src={post.val.imageLink} className="Card-Img" />
        <Card.Text>{post.val.text}</Card.Text>
      </Card>
    ));
    // Reverse the order of posts such that newest posts are on top
    postCards.reverse();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form onSubmit={this.handleSubmit}>
            <input
              type="file"
              value={this.state.fileInputValue}
              onChange={this.handleFileInputChange}
            />
            <br />
            <input
              type="text"
              value={this.state.textInputValue}
              onChange={this.handleTextInputChange}
            />
            <input
              type="submit"
              value="Send"
              // Disable Send button when text input is empty
              disabled={!this.state.textInputValue}
            />
          </form>
          <br />
          {postCards}
        </header>
      </div>
    );
  }
}

export default App;
