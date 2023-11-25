import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import "./App.css";
import Message from "./Message";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      input: "",
      dateTime: new Date(),
    };
  }

  tick() {
    this.setState({ dateTime: new Date() });
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
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
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: this.state.input,
      date: new Date().toLocaleString(),
    });
  };

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Message messages={this.state.messages} />
          {this.state.dateTime.toLocaleString()}
          <input
            value={this.state.value}
            onChange={this.handleChange}
            placeholder="Please type in message"
          />
          <button onClick={this.writeData}>Send</button>
        </header>
      </div>
    );
  }
}

export default App;
