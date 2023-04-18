import React from "react";
import { onChildAdded, push, ref } from "firebase/database";
import { database } from "./firebase";
import "./App.css";
import { MessageBubble } from "./Components/MessageBubble";

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
      console.log(data.val());
    });
  }

  writeData = (message) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const date = new Date();
    const messageLog = {
      content: message,
      date: JSON.stringify(date),
    };
    push(messageListRef, messageLog);
    // const newMessageRef = push(messageListRef, messageLog);
    // set(newMessageRef, messageLog);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.writeData(this.state.input);
    this.setState({
      input: "",
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  render() {
    let messageListItems = this.state.messages.map((message) => (
      <MessageBubble key={message.key}>{message}</MessageBubble>
    ));
    return (
      <div className="App">
        <div className="phone">
          <ul className="messages">
            {messageListItems}
            <li
              ref={(e) => {
                this.messagesEnd = e;
              }}
            ></li>
          </ul>
          <form onSubmit={this.handleSubmit}>
            <input
              name="input"
              type="text"
              value={this.state.input}
              onChange={this.handleChange}
              autoComplete="off"
              placeholder="Type here"
            ></input>
            <input type="submit" value="⬆" />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
