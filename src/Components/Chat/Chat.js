import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "../../firebase";
import React from "react";

const DB_MESSAGES_KEY = "messages";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      textInput: "",
      messages: [],
      date: "",
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
    this.setState({ textInput: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.writeData();
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      textInput: this.state.textInput,
      date: new Date().toLocaleString(),
    });
  };

  render() {
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>
        {message.val.textInput} - {message.val.date}
      </li>
    ));
    return (
      <div className="app-header">
        <form>
          <input
            type="text"
            value={this.state.textInput}
            placeholder="Send a message!"
            onChange={(event) => this.handleChange(event)}
          ></input>
          <button onClick={(event) => this.handleSubmit(event)}>Send</button>
        </form>
        <ol>{messageListItems}</ol>
      </div>
    );
  }
}

export default Chat;
