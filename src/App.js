import React from "react";
import { onChildAdded, push, ref, set, remove } from "firebase/database";
import { database } from "./firebase";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
    set(newMessageRef, {
      text: this.state.newInput,
      date: new Date().toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
      }),
    });
    this.setState(() => ({ newInput: "" }));
  };

  deleteData = () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete all data?"
    );
    if (confirmation) {
      const messageListRef = ref(database, DB_MESSAGES_KEY);
      remove(messageListRef)
        .then(() => {
          console.log("Data deleted successfully.");
          this.setState({ messages: [] });
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
        });
    }
  };

  handleChange = (e) => {
    this.setState(() => ({ newInput: e.target.value }));
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <p key={message.key}>
        {message.val.date}: {message.val.text}
      </p>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <div
            style={{
              position: "fixed",
              bottom: "10vh",
              width: "50%",
              display: "flex",
              textAlign: "left",
            }}
          >
            <ol>{messageListItems}</ol>
          </div>
          <div
            style={{
              position: "fixed",
              bottom: "5vh",
              width: "50%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              class="form-control form-control-lg"
              placeholder="What's on your mind?"
              value={this.state.newInput}
              onChange={(e) => this.handleChange(e)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission
                  this.writeData();
                }
              }}
              style={{ width: "100%" }}
            />
            <button
              type="button"
              class="btn btn-primary btn-lg"
              onClick={this.writeData}
              disabled={!this.state.newInput}
            >
              Send
            </button>
            <button
              type="button"
              class="btn btn-danger btn-lg"
              onClick={this.deleteData}
              disabled={this.state.messages.length === 0}
            >
              Delete
            </button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;

// flow of information goes from the user input > database child location > onChildAdded listener which setStates to update the messages array with the latest message > render () {} then maps out the messages
