import React from "react";
import { onChildAdded, push, ref, set, remove } from "firebase/database";
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import MessageUpdate from "./Components/MessageUpdate";

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
      isEditing: false,
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

  handleChange = (e) => {
    this.setState({ textInputValue: e.target.value });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (event) => {
    event.preventDefault();
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: this.state.textInputValue,
      date: new Date().toLocaleString(),
    });

    this.setState({ textInputValue: "" });
  };

  deleteMessage = (key) => {
    const messageRef = ref(database, `${DB_MESSAGES_KEY}/${key}`);

    remove(messageRef)
      .then(() => {
        console.log("Data deleted");

        const updatedMessages = this.state.messages.filter(
          (el) => el.key !== key
        );

        this.setState({ messages: updatedMessages });
        console.log(this.state.messages);
      })
      .catch((err) => {
        console.log("Error in deleting data:", err);
      });
  };

  handleUpdateClick = () => {
    this.setState({ isEditing: true });
  };

  handleUpdateComplete = () => {
    this.setState({ isEditing: false });
  };

  handleMessageUpdate = (key, updatedMessage) => {
    const updatedMessages = this.state.messages.map((message) => {
      if (message.key === key) {
        return {
          key: message.key,
          val: { ...message.val, message: updatedMessage },
        };
      }

      return message;
    });

    this.setState({ messages: updatedMessages });
  };

  render() {
    console.log(this.state.messages);
    // Convert messages in state to message JSX elements to render
    // let messageListItems = this.state.messages.map((message) => (
    //   <li key={message.key}>{message.val}</li>
    // ));
    let messageListItems = this.state.messages.map((obj) => (
      <div key={obj.key}>
        <li>
          {obj.val.message} at {obj.val.date}
        </li>
        {this.state.isEditing ? (
          <MessageUpdate
            id={obj.key}
            message={obj.val.message}
            onHandleComplete={this.handleUpdateComplete}
            onUpdateMessage={(updatedMessage) =>
              this.handleMessageUpdate(obj.key, updatedMessage)
            }
          />
        ) : (
          <div></div>
        )}
        <button onClick={this.handleUpdateClick}>Edit</button>
        <button onClick={() => this.deleteMessage(obj.key)}> Delete </button>
      </div>
    ));

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form onSubmit={this.writeData}>
            <input
              type="text"
              value={this.state.textInputValue}
              onChange={this.handleChange}
            />
            <input
              type="submit"
              value="Send"
              disabled={!this.state.textInputValue}
            />
          </form>
          {/* <button onClick={this.writeData}>Send</button> */}
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
