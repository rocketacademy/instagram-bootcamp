import React from "react";
import Card from "react-bootstrap/Card";
import logo from "./logo.png";
import "./App.css";

import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "./firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const POSTS_FOLDER_NAME = "posts";
const IMAGES_FOLDER_NAME = "images";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty posts array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      inputMessage: "",
      posts: [],
      fileInputFile: null,
      fileInputValue: "",
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    const postsRef = databaseRef(database, POSTS_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering posts
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  writeData = () => {
    //const messageListRef = databaseRef(database, DB_posts_KEY);
    //const newMessageRef = push(messageListRef);

    //let d = new Date(),
    //  dformat =
    //    [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("-") +
    //    " " +
    //    [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");

    //set(newMessageRef, {
    //  datetime_message: dformat,
    //  message: this.state.inputMessage,
    //});

    // Create a child reference
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
          text: this.state.inputMessage,
        });

        // Reset input field after submit
        this.setState({
          inputMessage: "",
          fileInputFile: null,
          fileInputValue: "",
        });
      });
    });
  };

  handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      // 13 represents the "Enter" key
      event.preventDefault(); // Prevents the default form submission behavior
      this.writeData();
    }
  };

  render() {
    // Convert posts in state to message JSX elements to render
    let postCards = this.state.posts.map((post) => (
      <Card bg="dark" key={post.key}>
        <Card.Img src={post.val.imageLink} className="Card-Img" />
        <Card.Text>{post.val.text}</Card.Text>
      </Card>
    ));

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <form>
            {/* File input example */}
            <input
              type="file"
              // Set state's fileInputValue to "" after submit to reset file input
              value={this.state.fileInputValue}
              onChange={(e) => {
                // e.target.files is a FileList object that is an array of File objects
                // e.target.files[0] is a File object that Firebase Storage can upload
                this.setState({
                  fileInputFile: e.target.files[0],
                  fileInputValue: e.target.value,
                });
              }}
            />
            <br />

            {/* Text input example */}
            <label>
              Post Pictures:&nbsp;&nbsp;
              <input
                type="text"
                value={this.state.inputMessage}
                onChange={(e) =>
                  this.setState({ inputMessage: e.target.value })
                }
              />
              &nbsp;&nbsp;&nbsp;
              <button onClick={this.writeData}>Send</button>
            </label>
          </form>

          <ol>{postCards}</ol>
        </header>
      </div>
    );
  }
}

export default App;
