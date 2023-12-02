import React from "react";
import {
  getStorage,
  uploadBytes,
  ref as Sref,
  getDownloadURL,
} from "firebase/storage";
import Card from "react-bootstrap/Card";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      textInput: "",
      messages: [],
      date: "",
      fileInputFile: null,
      fileInputValue: "",
      downloadURL: "",
      newPost: null,
      postList: [],
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  handleChange = (event) => {
    this.setState({ textInput: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.writeData();
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      textInput: this.state.textInput,
      date: new Date().toLocaleString(),
    });
  };

  addPost = (event) => {
    event.preventDefault();
    const storage = getStorage();
    // Creates a child reference and imagesRef now points to a dynamic reference to the images folder
    const imagesRef = Sref(storage, this.state.fileInputValue);
    // Initialize file as new File
    uploadBytes(imagesRef, this.state.fileInputFile).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    getDownloadURL(Sref(storage, this.state.fileInputValue)).then((url) => {
      this.setState({
        postList: [...this.state.postList, url],
        fileInputValue: "",
      });
    });
    console.log("post added");
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>
        {message.val.textInput} - {message.val.date}
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          {this.state.postList.map((url, index) => (
            <Card key={index} src={url}>
              <Card.Img variant="top" src={url} />
            </Card>
          ))}
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form>
            <input
              type="text"
              value={this.state.textInput}
              placeholder="Send a message!"
              onChange={(event) => this.handleChange(event)}
            ></input>
            <button onClick={(event) => this.handleSubmit(event)}>Send</button>
            <input
              type="file"
              onChange={(event) =>
                this.setState({
                  fileInputFile: event.target.files[0],
                  fileInputValue: event.target.files[0].name,
                })
              }
            ></input>
            <button onClick={(event) => this.addPost(event)}>
              Upload File
            </button>
          </form>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
