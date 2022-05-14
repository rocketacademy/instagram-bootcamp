import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import React from "react";
import { database, storage } from "../firebase";

// Save Firebase folder names as constants to avoid bugs due to misspelling
const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

class Composer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
    };
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
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadUrl,
          text: this.state.textInputValue,
          authorEmail: this.props.loggedInUser.email,
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
          value="Post"
          // Disable Send button when text input is empty
          disabled={!this.state.textInputValue}
        />
      </form>
    );
  }
}

export default Composer;
