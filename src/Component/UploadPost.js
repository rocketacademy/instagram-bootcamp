import React from "react";
import { push, ref as realTimeDatabaseRef, set } from "firebase/database";
import { realTimeDatabase, storage } from "../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

const STORAGE_KEY = "images/";

class UploadPost extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messageInput: "",
      fileInputFile: { name: "" },
      fileInputValue: "",
    };
  }

  handleMessageChange = (e) => {
    this.setState({ messageInput: e.target.value });
  };

  handlePhotoUpload = (e) =>
    // e.target.files is a FileList object that is an array of File objects
    // e.target.files[0] is a File object that Firebase Storage can upload
    this.setState({
      fileInputFile: e.target.files[0],
      fileInputValue: e.target.file,
    });

  writeData = (url) => {
    const PostRef = realTimeDatabaseRef(
      realTimeDatabase,
      this.props.DB_MESSAGES_KEY
    );
    const newPostRef = push(PostRef);

    set(newPostRef, {
      name: "to update in upload post",
      message: this.state.messageInput,
      dateTime: new Date().toLocaleString(),
      url: url,
    });

    this.setState({
      messageInput: "",
      fileInputFile: { name: "" },
      fileInputValue: "",
    });
  };

  handlePostSubmit = (e) => {
    e.preventDefault();

    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );

    this.state.fileInputFile.name !== ""
      ? uploadBytes(fullStorageRef, this.state.fileInputFile).then(
          (snapshot) => {
            getDownloadURL(fullStorageRef, this.state.fileInputFile.name).then(
              (url) => {
                this.writeData(url);
              }
            );
          }
        )
      : this.writeData("");
  };

  render() {
    return (
      <form onSubmit={this.handlePostSubmit}>
        {/* message input */}
        <h3>Message</h3>
        <input
          type="text"
          value={this.state.messageInput}
          onChange={this.handleMessageChange}
        />{" "}
        <br />
        <br />
        {/* photo upload */}
        <div className="inputContainer">
          <label>
            {this.state.fileInputFileName !== ""
              ? "Change Photo"
              : "Select Photo"}{" "}
            <br />
            <br />
            <i className="fa fa-2x fa-camera"></i>
            <input
              className="inputTag"
              type="file"
              accept="image/png, image/jpg, image/gif, image/jpeg"
              // Set state's fileInputValue to "" after submit to reset file input
              value={this.state.fileInputValue}
              onChange={this.handlePhotoUpload}
            />
            <br />
          </label>
        </div>
        <br />
        {this.state.fileInputFile.name !== ""
          ? `Photo selected: ${this.state.fileInputFile.name}`
          : "No file selected"}
        <br />
        <br />
        <input type="submit" value="Post" />
      </form>
    );
  }
}

export default UploadPost;
