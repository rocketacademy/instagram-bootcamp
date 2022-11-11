import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import React from "react";
import { database, storage } from "../firebase";

const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

export default class Composer extends React.Component {
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

  handleSubmit = (event) => {
    event.preventDefault();

    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${this.state.fileInputFile.name}`,
    );

    uploadBytes(fileRef, this.state.fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadUrl,
          text: this.state.textInputValue,
          authorEmail: this.props.loggedInUser.email,
        });

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
        {this.props.loggedInUser && <p>{this.props.loggedInUser.email}</p>}
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
          disabled={!this.state.textInputValue}
        />
      </form>
    );
  }
}
