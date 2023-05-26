import React from "react";
import { push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// styling
import "../App.css";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

class InstagramForm extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      textInputValue: "",
      date: "",
      time: "",
      fileInputFile: null,
      fileInputValue: "",
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

  writeData = (url) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: this.state.textInputValue,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      url: url,
    });
    this.setState({
      message: "",
      date: "",
      time: "",
      fileInputFile: null,
      fileInputValue: "",
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  handleSubmit = (event) => {
    event.preventDefault();
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
      <div className="App">
        <header className="App-header">
          <h2>Rocketgram</h2>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                value={this.state.textInputValue}
                onChange={this.handleTextInputChange}
                type="text"
                placeholder="What's your photo about?"
              />
              <input
                className="form-control form-control-sm"
                variant="secondary"
                type="file"
                name="file"
                value={this.state.fileInputValue}
                onChange={this.handleFileInputChange}
              />
              <Button
                as="input"
                type="submit"
                value="Send"
                // Disable Send button when text input is empty
                disabled={!this.state.textInputValue}
                variant="primary"
              />
            </Form.Group>
          </Form>
        </header>
      </div>
    );
  }
}

export default InstagramForm;
