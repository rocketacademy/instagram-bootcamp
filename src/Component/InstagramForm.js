import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";
import "../App.css";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
// import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

export default class InstagramForm extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      // messages: [],
      textInputValue: "",
      date: "",
      time: "",
      fileInputFile: null,
      fileInputValue: "",
    };
  }

  // componentDidMount() {
  //   const messagesRef = ref(database, DB_MESSAGES_KEY);
  //   // onChildAdded will return data for every child at the reference and every subsequent new child
  //   onChildAdded(messagesRef, (data) => {
  //     // Add the subsequent child to local component state, initialising a new array to trigger re-render
  //     this.setState((state) => ({
  //       // Store message key so we can use it as a key in our list items when rendering messages
  //       messages: [...state.messages, { key: data.key, val: data.val() }],
  //     }));
  //   });
  // }

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
      date: "",
      time: "",
      fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
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
      getDownloadURL(fullStorageRef).then((url) => {
        this.writeData(url);
      });
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    // let messageListItems = this.state.messages.map((message) => (
    //   <Card border="light" bg="light" key={message.key}>
    //     <Card.Header as="h4">Post</Card.Header>
    //     <Card.Body>
    //       <Card.Text>
    //         {" "}
    //         Description: {message.val.message} <br />
    //       </Card.Text>
    //     </Card.Body>
    //     <Card.Img src={message.val.url} alt={message.val.message} />
    //     <Card.Footer className="text-muted">
    //       {" "}
    //       Date:{message.val.date} - {message.val.time}
    //     </Card.Footer>
    //   </Card>
    // ));
    return (
      <div>
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

        {/* <div>{messageListItems}</div> */}
      </div>
    );
  }
}
