import React from "react";
import { push, ref, set } from "firebase/database";
import { database, storage, auth } from "../firebase";
import { TextField, Button } from "@mui/material";
import { updateProfile } from "firebase/auth";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_USER_KEY = "user";

export default class ChatCall extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      post: "",
      userID: this.props,
      fileInputFile: null,
      fileInputValue: "",
    };
  }

  componentDidMount = () => {};

  handleEdit = () => {
    const { userID } = this.props;
  };
}
