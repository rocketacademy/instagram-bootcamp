import React from "react";
import { push, ref, set } from "firebase/database";
import { database } from "../firebase";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";
// import {ref as storageRef, uploadBytes, getDownloadURL} from "firebase/storage";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
// const STORAGE_KEY='images/'

export default class ChatCall extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      message: "",
      userID: "",
      errorID: false,
      errorMsg: false,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      userID: this.state.userID,
      message: this.state.message,
      date: new Date().toLocaleTimeString(),
    });

    this.setState({
      message: "",
      userID: "",
      errorID: false,
      errorMsg: false,
    });
  };

  render() {
    return (
      <div>
        <FormControl>
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
        </FormControl>
        <br />
        <FormControl>
          <TextField
            name="message"
            label="Message"
            value={this.state.message}
            onChange={(e) => this.handleChange(e)}
            multiline
            maxRows={4}
            color="secondary"
            variant="standard"
            size="small"
            required
            focused
          />
        </FormControl>
        <br />
        <button type="submit" value="submit" onClick={this.writeData}>
          Send
        </button>
      </div>
    );
  }
}
