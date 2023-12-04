import React from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

class Composer extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
    };
  }

  // componentDidMount() {
  //   const postsRef = databaseRef(database, POSTS_FOLDER_NAME);
  //   // onChildAdded will return data for every child at the reference and every subsequent new child
  //   onChildAdded(postsRef, (data) => {
  //     // Add the subsequent child to local component state, initialising a new array to trigger re-render
  //     this.setState((state) => ({
  //       // Store message key so we can use it as a key in our list items when rendering messages
  //       posts: [...state.posts, { key: data.key, val: data.val() }],
  //     }));
  //   });
  // }

  handleFileInputChange = (e) => {
    this.setState({
      fileInputFile: e.target.files[0],
      fileInputValue: e.target.value,
    });
  };

  // store text input
  handleTextInputChange = (e) => {
    this.setState({ textInputValue: e.target.value });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  handleSubmit = (e) => {
    e.preventDefault();

    // Store images in an image folder in Firebase Storage
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
    return (
      <form onSubmit={this.handleSubmit}>
        {/* TODO: Add input field and add text input as messages in Firebase */}
        <p>{this.props.loggedInUser ? this.props.loggedInUser.email : null}</p>
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
          disabled={!this.state.textInputValue}
        />
      </form>
    );
  }
}

export default Composer;
