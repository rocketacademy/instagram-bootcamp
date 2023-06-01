import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "../firebase";

const DB_MESSAGES_KEY = "messages";

export default class MessageSubmit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      inputValue: "",
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
    this.setState({ inputValue: event.target.value });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  handleSubmit = (event) => {
    const displayName = this.props.displayName;
    event.preventDefault();
    const date = new Date();
    const timeSent = date.toLocaleString("en-GB");

    const { inputValue } = this.state;

    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, `${timeSent} <br>${displayName}: ${inputValue} `);

    this.setState({ inputValue: "" });
  };

  render() {
    //const { fileInputValue } = this.state;
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li
        key={message.key}
        dangerouslySetInnerHTML={{ __html: message.val }}
      ></li>
    ));
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Message</label>
          <br />
          <input
            type="text"
            name="inputValue"
            value={this.state.inputValue}
            onChange={this.handleChange}
          />

          <br />
        </form>

        {messageListItems[0] ? (
          <ul>{messageListItems}</ul>
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    );
  }
}
