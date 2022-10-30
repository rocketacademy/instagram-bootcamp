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
      textInputValue: "",
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

  handleChange = (event) => {
    this.setState({
      textInputValue: event.target.value,
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const currentTimestamp = new Date().toJSON().slice(0, 19);
    console.log(currentTimestamp);
    const messageListRef = ref(database, MESSAGE_FOLDER_NAME);
    // push(): Add to a list of data in the database. Every time you push a new node onto a list, your database generates a unique key, like messages/<unique-message-id>/<message-data>
    //  By using unique child keys, several clients can add children to the same location at the same time without worrying about write conflicts.
    const newMessageRef = push(messageListRef);
    console.log(newMessageRef);
    set(newMessageRef, {
      message: this.state.textInputValue,
      date: currentTimestamp,
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((data) => (
      <li key={data.key}>
        {"Message: " + data.val.message + " Timestamp: " + data.val.date}
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form>
            <input
              type="text"
              value={this.state.textInputValue}
              onChange={this.handleChange}
            ></input>

            <button
              onClick={this.writeData}
              disabled={!this.state.textInputValue}
            >
              Send
            </button>
          </form>

          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
