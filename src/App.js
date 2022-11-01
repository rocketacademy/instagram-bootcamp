import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, MESSAGE_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  handleTextChange = (e) => {
    this.setState({
      currentText: e.target.value,
      messageTime: new Date().toLocaleTimeString(),
      messageDate: new Date().toLocaleDateString(),
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (e) => {
    e.preventDefault();
    const messageListRef = ref(database, MESSAGE_FOLDER_NAME);
    const newMessageRef = push(messageListRef);
    set(
      newMessageRef,
      this.state.currentText +
        `` +
        this.state.messageTime +
        " | " +
        this.state.messageDate
    );
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>{message.val}</li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form>
            <input onChange={(e) => this.handleTextChange(e)} />
            <button onClick={this.writeData}>Send</button>
          </form>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
