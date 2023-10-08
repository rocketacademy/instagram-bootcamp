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

  handleChange = (event) => {
    this.setState({ textInputValue: event.target.value})
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class

  handleSubmit = (event) => {
    event.preventDefault();
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, this.state.textInputValue);
    this.setState({textInputValue: ""})
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>{message.val}</li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.textInputValue} onChange={this.handleChange}></input>
          <input
              type="submit"
              value="Send"
              // Disable Send button when text input is empty
              disabled={!this.state.textInputValue}
            />
            </form>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
