import React from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "./firebase";
import "./App.css";

const POSTS_FOLDER_NAME = "posts";
const IMAGES_FOLDER_NAME = "images";

class Composer extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      inputTextValue: "",
      fileInputFile: null,
      fileInputValue: "",
    };
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
        const messagesListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newMessagesRef = push(messagesListRef);
        set(newMessagesRef, {
          imageLink: downloadUrl,
          text: this.state.inputTextValue,
          authorEmail: this.props.loggedInUser.email,
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
    return (
      <form onSubmit={this.handleSubmit}>
        <p>{this.props.loggedInUser ? this.props.loggedInUser.email : null}</p>
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
        <input
          type="submit"
          value="Upload!"
          disabled={!this.state.inputTextValue}
        />
      </form>
    );
  }
}

export default Composer;
