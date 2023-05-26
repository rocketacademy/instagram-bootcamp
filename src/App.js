import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database,storage } from "./firebase";
import {ref as storageRef, uploadBytes,getDownloadURL} from "firebase/storage";

import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
     inputValue:"",
     fileInputFile: null,
      fileInputValue: "",
      textInputValue: "",
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

  handleChange=(event)=> {
    
    this.setState({ inputValue: event.target.value });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  handleSubmit = (event) => {
    event.preventDefault();
    const date= new Date();
    const timeSent= date.toLocaleString("en-GB");
    console.log(timeSent);
    const { inputValue } = this.state;
    
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, `${timeSent}: ${inputValue} `);
    this.setState({inputValue:""})
  };

  writeData = (url) => {
    const PostRef = storageRef(database, DB_MESSAGES_KEY);
    const newPostRef = push(PostRef);

    set(newPostRef, {
      name: this.state.name,
      message: this.state.messageInput,
      dateTime: new Date().toLocaleString(),
      url: url,
    });

    this.setState({
      messageInput: "",
      fileInputFile: null,
      fileInputValue: "",
    });
  };

  handleSubmitPicture = (e) => {
    e.preventDefault();

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
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>{message.val}</li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.handleSubmit}>
            <label>
              <input
                type="text"
                name="inputValue"
                value={this.state.inputValue}
                onChange={this.handleChange}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
          
          <ul>{messageListItems}</ul>
          <form onSubmit={this.handleSubmitPicture}>
          {/* File input example */}
          <input
            type="file"
            // Set state's fileInputValue to "" after submit to reset file input
            value={this.state.fileInputValue}
            onChange={(e) =>
              // e.target.files is a FileList object that is an array of File objects
              // e.target.files[0] is a File object that Firebase Storage can upload
              this.setState({ fileInputFile: e.target.files[0] })
            }
          />
          {/* Text input example */}
          <input
            type="text"
            value={this.state.textInputValue}
            onChange={(e) => this.setState({ textInputValue: e.target.value })}
          />
        </form>
        </header>
      </div>
    );
  }
}

export default App;
