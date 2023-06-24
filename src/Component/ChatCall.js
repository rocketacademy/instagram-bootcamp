import React from "react";
import { push, ref, set } from "firebase/database";
import { database } from "../firebase";
import { TextField, FormControl, Button } from "@mui/material";
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
      userID: this.props,
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
    const { userID } = this.props;
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      userID: userID,
      message: this.state.message,
      date: new Date().toLocaleTimeString(),
    });

    this.setState({
      message: "",
      errorID: false,
      errorMsg: false,
    });
  };

  render() {
    return (
      <div>
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
        <Button
          variant="contained"
          color="secondary"
          size="small"
          type="submit"
          value="submit"
          onClick={this.writeData}
        >
          Send
        </Button>
      </div>
    );
  }
}
