import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";
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
      messages: [],
      inputMessage: "",
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [
          ...state.messages,
          { key: data.key, text: data.val().text, date: data.val().date },
        ],
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, { text: this.state.inputMessage, date: "today" });
  };

  handleInputChange = (e) => {
    this.setState({
      inputMessage: e.target.value,
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <div key={message.key} className="message-bubble">
        <div>{message.text}</div>
        <div className="message-date">{message.date}</div>
      </div>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <input type="text" onChange={this.handleInputChange}></input>
          <button onClick={this.writeData}>Send</button>
          <div className="message-container">{messageListItems}</div>
        </header>
      </div>
    );
  }
}

export default App;
