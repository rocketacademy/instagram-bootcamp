import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";
// where to put the messages
const messagesRef = ref(database, MESSAGE_FOLDER_NAME);

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      textBlankInput: "",
    };
  }

  componentDidMount() {
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  // // Note use of array fields syntax to avoid having to manually bind this method to the class
  // writeData = () => {
  //   const messageListRef = ref(database, MESSAGE_FOLDER_NAME);
  //   const newMessageRef = push(messageListRef);
  //   set(newMessageRef, "abc");
  // };

  //handleChange
  handleChange = (event) => {
    this.setState({ textBlankInput: event.target.value });
    // this.setState((prevState) => {
    //   return { ...prevState, textBlankInput: event.target.value };
    // });
  };

  //handleSubmit which will set the message into the target folder on firebase;
  handleSubmit = (event) => {
    event.preventDefault();
    // pass to firebase;

    const newMessageRef = push(messagesRef);
    set(newMessageRef, this.state.textBlankInput);
    //
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
          <h1>Rocketgram!</h1>
          <form onSubmit={this.handleSubmit}>
            <p>Start chatting here!</p>
            <input
              type="text"
              value={this.state.textBlankInput}
              onChange={this.handleChange}
            />
            <input
              type="submit"
              value="Submit"
              disabled={!this.state.textBlankInput}
            />
          </form>
          {/* <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          TODO: Add input field and add text input as messages in Firebase */}
          {/* <button onClick={this.writeData}>Send</button> */}
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
