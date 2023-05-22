import React from "react";
import { onChildAdded, push, ref, set, remove } from "firebase/database";
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
      newInput: "",
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

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    // create a variable for the location where the list of messages are found in the database
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    // create another variable for the child at the location where the list of messages are found in the database
    const newMessageRef = push(messageListRef);
    // write data at this child location with the string "abc"
    set(newMessageRef, this.state.newInput);
    this.setState(() => ({ newInput: "" }));
  };

  deleteData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    console.log(this.state.messages);
    remove(messageListRef)
      .then(() => {
        console.log("Data deleted successfully.");
        this.setState({ messages: [] });
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  handleChange = (e) => {
    this.setState(() => ({ newInput: e.target.value }));
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
          <input
            type="text"
            placeholder="Input text here"
            value={this.state.newInput}
            onChange={(e) => this.handleChange(e)}
          />
          <button onClick={this.writeData}>Send</button>
          <ol>{messageListItems}</ol>
          <button onClick={this.deleteData}>Delete All</button>
        </header>
      </div>
    );
  }
}

export default App;

// flow of information goes from the user input > database child location > onChildAdded listener which setStates to update the messages array with the latest message > render () {} then maps out the messages
