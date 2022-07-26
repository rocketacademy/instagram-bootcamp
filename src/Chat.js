import React from "react";
import { onChildAdded, ref, set, child, push } from "firebase/database";
import { database } from "./firebase";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "Messages";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      input: "",
      key: 0,
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

  handleInput = (event) => {
    this.setState(() => ({
      // Store message key so we can use it as a key in our list items when rendering messages
      input: event.target.value,
    }));
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  // writeData = (event) => {
  //   const messageListRef = ref(database, MESSAGE_FOLDER_NAME);

  //   const newMessageRef = child(messageListRef, this.state.key);

  //   set(newMessageRef, this.state.input);

  //   this.setState((prevState) => ({
  //     // Store message key so we can use it as a key in our list items when rendering messages
  //     input: "",
  //     key: this.prevState.key + 1,
  //   }));
  // };

  handleSubmit = (event) => {
    event.preventDefault();
    const messageListRef = ref(database, MESSAGE_FOLDER_NAME);

    const newMessageRef = child(messageListRef, this.state.key.toString());

    set(newMessageRef, this.state.input);

    this.setState(() => ({
      // Store message key so we can use it as a key in our list items when rendering messages
      input: "",
      key: this.state.key + 1,
    }));
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>{message.val}</li>
    ));
    return (
      <div className="Chat">
        <ul style={{ listStyleType: "none" }}>{messageListItems}</ul>
        <form onSubmit={this.handleSubmit}>
          <label>
            Input:
            <input
              type="text"
              id="input"
              onChange={this.handleInput}
              value={this.state.input}
            />
          </label>
          <input type="submit" value="enter" />
        </form>
      </div>
    );
  }
}

export { Chat };
