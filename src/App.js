import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      name: "",
      messageInput: "",
      nameInput: "",
    };
    this.handleMessageChange = this.handleMessageChange.bind(this);
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

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  handleMessageChange = (event) => {
    this.setState({ messageInput: event.target.value });
  };

  handleMessageSubmit = (event) => {
    event.preventDefault();

    const currentDateTime = new Date().toLocaleString();

    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(
      newMessageRef,
      `Name: ${this.state.name} 
      |Message: ${this.state.messageInput}
      |DateTime: ${currentDateTime}`
    );
  };

  handleNameChange = (event) => {
    this.setState({ nameInput: event.target.value });
  };

  handleNameSubmit = (event) => {
    event.preventDefault();

    this.setState({ name: this.state.nameInput });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>
        {/* Render each part of message in separate lines */}
        {message.val.split("|").map((parts) => (
          <div>{parts}</div>
        ))}
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          {/* Prompt user to enter name */}
          {this.state.name === "" && (
            <div>
              <h3>How do we address you?</h3>
              <form onSubmit={this.handleNameSubmit}>
                <label>
                  <input
                    type="text"
                    value={this.state.nameInput}
                    onChange={this.handleNameChange}
                  />{" "}
                  <input type="submit" value="Enter" />
                </label>
              </form>
            </div>
          )}

          {/* TODO: Add input field and add text input as messages in Firebase */}
          {this.state.name !== "" && (
            <div>
              <h3>Message</h3>
              <form onSubmit={this.handleMessageSubmit}>
                <label>
                  <input
                    type="text"
                    value={this.state.messageInput}
                    onChange={this.handleMessageChange}
                  />{" "}
                  <input type="submit" value="Send" />
                </label>
              </form>
              <br />
              <ol>{messageListItems}</ol>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
