import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const DB_TS_KEY = "timestamps";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      message: "",
      timestamps: [],
      timestamp: "",
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
    const timestampRef = ref(database, DB_TS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(timestampRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        timestamps: [...state.timestamps, { key: data.key, val: data.val() }],
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, this.state.message);
    const timestampListRef = ref(database, DB_TS_KEY);
    const newTimestampRef = push(timestampListRef);
    set(newTimestampRef, this.state.timestamp);
  };

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.message.length === 0) {
      return;
    }
    this.setState({ timestamp: new Date().toLocaleString("en-GB") }, () => {
      this.writeData();
      this.setState({ message: "", timestamp: "" });
    });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message, index) => (
      <div className="container">
        <div key={this.state.timestamps[index].key} className="timestamp">
          {this.state.timestamps[index].val}
        </div>
        <div key={message.key} className="message">
          {message.val}
        </div>
      </div>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Form onSubmit={this.handleSubmit}>
            <Form.Control
              as="textarea"
              rows={2}
              name="message"
              placeholder="Write your message here!"
              value={this.state.message}
              onChange={this.handleChange}
            />
            <Button variant="light" type="submit">
              Send
            </Button>
          </Form>
          {messageListItems}
        </header>
      </div>
    );
  }
}
