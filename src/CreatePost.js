import React from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { database, storage } from "./firebase";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import ProgressBar from "react-bootstrap/ProgressBar";
import Button from "@mui/material/Button";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";
const STORAGE_KEY = "images/";

class PostForm extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
      percent: 0,
    };
  }

  componentDidUpdate() {
    //console.log(this.state);
  }

  //POST to database
  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    const postsListRef = databaseRef(database, DB_POSTS_KEY);
    const newPostRef = push(postsListRef);

    let today = new Date();

    let currentDate =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let currentTime = hours + ":" + minutes + ampm;

    let DATEANDTIME = `${currentDate} ${currentTime}`;

    set(newPostRef, {
      datetime: DATEANDTIME,
      description: this.state.textInputValue,
      imagelink: url,
      author: this.props.useremail,
    });
    alert(`The post has been created !`)
    this.setState({
      textInputValue: "",
      fileInputFile: null,
      fileInputValue: "",
      percent: 0,
    });
  };

  createPost = (e) => {
    e.preventDefault();

    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );

    const uploadTask = uploadBytesResumable(
      fullStorageRef,
      this.state.fileInputFile
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        
        this.setState({ percent: progress });
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          default:
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
      },
      () => {
        getDownloadURL(fullStorageRef, this.state.fileInputFile.name).then(
          (url) => {
            this.writeData(url);
          }
        );
      }
    );
  };

  render() {
    return (
      <div className="App">
        <h1>Create a post</h1>
        <br />
        <Form onSubmit={this.createPost}>
          <Row>
            <Col>
              {" "}
              {/* File input example */}
              <Form.Control
                type="file"
                // Set state's fileInputValue to "" after submit to reset file input
                value={this.state.fileInputValue}
                onChange={(e) =>
                  // e.target.files is a FileList object that is an array of File objects
                  // e.target.files[0] is a File object that Firebase Storage can upload
                  this.setState({
                    fileInputFile: e.target.files[0],
                    fileInputValue: e.target.file,
                  })
                }
              />
            </Col>
            <Col>
              {" "}
              {/* Text input example */}
              <Form.Control
                type="text"
                value={this.state.textInputValue}
                onChange={(e) =>
                  this.setState({ textInputValue: e.target.value })
                }
              />
            </Col>
          </Row>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <Button variant="outlined" type="submit">
            Submit
          </Button>
          <Row>
            {this.state.percent !== 0 && (
              <ProgressBar>
                <ProgressBar
                  animated
                  striped
                  variant="info"
                  now={this.state.percent}
                  label={`${this.state.percent}%`}
                />
              </ProgressBar>
            )}
          </Row>
        </Form>
        <br />
      </div>
    );
  }
}

export default PostForm;
