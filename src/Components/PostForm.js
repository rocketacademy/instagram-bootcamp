import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row, Col } from "react-bootstrap";
import { push, ref, set } from "firebase/database";
import { database, storage } from "./firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";
class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      fileInputFile: null,
      fileInputValue: "",
    };
  }

  handleChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };
  writeData = (url) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      text: this.state.inputValue,
      date: new Date().toLocaleDateString(undefined, {
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }),
      url: url,
    });
    this.setState({ inputValue: "", fileInputValue: "", fileInputFile: null });
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
        <h3>Create a post</h3>
        <Row className="align-items-center">
          <Col className="col-sm-3">
            <input
              className="input-file"
              type="file"
              name="file"
              value={this.state.fileInputValue}
              onChange={(e) => {
                this.setState({
                  fileInputFile: e.target.files[0],
                  fileInputValue: e.target.value,
                });
              }}
            ></input>
          </Col>
          <Col className="col-sm-6">
            <input
              className="input-text"
              type="text"
              name="text"
              placeholder="write your caption..."
              value={this.state.inputValue}
              onChange={this.handleChange}
            />
          </Col>
          <Col className="col-sm-2">
            <Button
              variant="outline-light"
              // size="lg"

              onClick={this.submit}
            >
              Post
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
export default PostForm;
