import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "../firebase.js";
import "../App.css";

const DB_MESSAGES_KEY = "messages";

class Textfield extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      inputField: "",
      messages: [],
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    this.unsubscribe = onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleChange = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    let newDate = new Date() - 0;
    // newDate = newDate - newDate.getTimezoneOffset() * 60000;
    set(newMessageRef, {
      text: this.state.inputField,
      date: newDate,
      name: this.props.name,
    });
    this.setState({ inputField: "" });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <div
        style={{
          textAlign: this.props.name === message.val.name ? "right" : "left",
        }}
        key={message.key}
      >
        <p className="msg-name">
          {this.props.name === message.val.name ? "You" : message.val.name}
        </p>
        <div className="msg-bubble">
          {message.val.text}
          <br />
          <span className="msg-date-time">
            {new Date(message.val.date).toLocaleTimeString()},
            {new Date(message.val.date).toLocaleDateString()}
          </span>
        </div>
      </div>
    ));
    return (
      <header className="App-header row">
        <h4>
          {this.props.name === ""
            ? "Please insert your name before chatting."
            : `Currently logged in as: ${this.props.name}`}
        </h4>
        <div className="msg-container col-lg-8 col-sm-12">
          {this.props.name === "" ? null : messageListItems}
        </div>

        {this.props.name !== "" && (
          <div>
            <input
              className="col-lg-8 col-sm-12"
              type="text"
              value={this.state.inputField}
              onChange={(e) => this.handleChange(e, "inputField")}
            />
            <button className="col-lg-8 col-sm-12" onClick={this.writeData}>
              Send
            </button>
          </div>
        )}
      </header>
    );
  }
}

export default Textfield;
