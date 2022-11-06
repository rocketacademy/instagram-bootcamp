import React from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";
const IMAGES_FOLDER_NAME = "images";

class Composer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
    };
  }

  handleTextInputChange = (event) => {
    this.setState({ textInputValue: event.target.value });
  };

  handleFileInputChange = (event) => {
    this.setState({
      fileInputFile: event.target.files[0],
      fileInputValue: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.textInputValue) return; // skip the rest of code if user didn't type anything

    // Store images in an images folder in Firebase Storage
    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${this.state.fileInputFile.name}`
    );

    // Upload file, save file download URL in database with post text
    uploadBytes(fileRef, this.state.fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const messageListRef = databaseRef(database, MESSAGE_FOLDER_NAME);
        const newMessageRef = push(messageListRef);
        set(newMessageRef, {
          imageLink: downloadUrl,
          createdAt: new Date().toLocaleString("en-GB"),
          authorEmail: this.props.loggedInUser.email,
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
      <form>
        <p>
          Signed in as:{" "}
          <a href="#login">
            {this.props.loggedInUser ? this.props.loggedInUser.email : null}
          </a>
        </p>
        {/* File input example */}
        <input
          type="file"
          value={this.state.fileInputValue}
          onChange={this.handleFileInputChange}
        />
        {/* Text input example */}
        <input
          type="text"
          value={this.state.textInputValue}
          onChange={this.handleTextInputChange}
        />
        <button onClick={this.handleSubmit}>Send</button>
        <p></p>
      </form>
    );
  }
}

export default Composer;
