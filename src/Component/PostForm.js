import React from "react";
import { push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";
import TextField from "@mui/material/TextField";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";
const STORAGE_KEY = "images/";

export default class ChatCall extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      post: "",
      userID: "",
      fileInputFile: null,
      fileInputValue: "",
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      {
        [name]: value,
      },
      () => {
        console.log(`${name}: ${value}`);
      }
    );
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    const postListRef = ref(database, DB_POSTS_KEY);
    const newPostRef = push(postListRef);
    set(newPostRef, {
      userID: this.state.userID,
      post: this.state.post,
      date: new Date().toLocaleTimeString(),
      url: url,
    });

    this.setState({
      userID: "",
      post: "",
      fileInputFile: null,
      fileInputValue: "",
    });
  };

  submit = () => {
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );

    uploadBytes(fullStorageRef, this.state.fileInputFile).then((snapshot) => {
      getDownloadURL(fullStorageRef, this.state.fileInputFile.name).then(
        (url) => {
          this.writeData(url);
        }
      );
    });
  };

  render() {
    return (
      <div>
        <br />
        <TextField
          name="userID"
          label="UserID"
          color="secondary"
          variant="standard"
          value={this.state.userID}
          onChange={(e) => this.handleChange(e)}
          size="small"
          focused
          required
        />
        <br />
        <TextField
          name="post"
          label="New Post"
          color="secondary"
          variant="standard"
          value={this.state.post}
          onChange={(e) => this.handleChange(e)}
          size="small"
          focused
          required
        />
        <br />
        <TextField
          type="file"
          name="file"
          color="secondary"
          variant="filled"
          size="small"
          value={this.state.fileInputValue}
          onChange={(e) => {
            this.setState({
              fileInputFile: e.target.files[0],
              fileInputValue: e.target.file,
            });
          }}
          focused
        />
        <br />

        <br />
        <button onClick={this.submit}>Send</button>
      </div>
    );
  }
}
