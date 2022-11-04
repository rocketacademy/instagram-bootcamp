import React from 'react';
import { onChildAdded, push, ref, set } from 'firebase/database';
import { db } from './firebase/index';
import logo from './logo.png';
import './App.css';
import { FileUpload } from './components/FileUpload';
import Button from '@mui/material/Button';

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = 'messages';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      inputValue: '',
      date: ''
    };
  }

  componentDidMount() {
    const messagesRef = ref(db, MESSAGE_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }]
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (e) => {
    e.preventDefault();
    const messageListRef = ref(db, MESSAGE_FOLDER_NAME);
    const newMessageRef = push(messageListRef);
    const currDateTime = Date(Date.now());
    set(newMessageRef, {
      message: this.state.inputValue,
      date: currDateTime
    })
      .then(() => {
        // Data saved successfully!
        console.log('data written successfully!');
      })
      .catch((error) => {
        // The write failed...;
        console.log('data failed to write');
      });

    this.setState({
      inputValue: ''
    });
  };

  handleFormChange = (e) => {
    this.setState({
      inputValue: e.target.value
    });
    console.log(this.state.inputValue);
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <>
        <p key={message.key}>
          {message.val.message} {message.val.date}
        </p>
      </>
    ));
    console.log(this.state);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <input
            type="text"
            name="inputValue"
            value={this.state.inputValue}
            id="name"
            onChange={this.handleFormChange}
          />
          <Button variant="contained" onClick={this.writeData}>
            Send
          </Button>
          <div className="bubble">{messageListItems}</div>

          <p>Upload your photos here!</p>
          <FileUpload />
        </header>
      </div>
    );
  }
}

export default App;
