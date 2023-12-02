import React from "react";
import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

export default class ChatMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
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

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message, index) => (
      <li
        key={message.key}
        className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"}`} //alternate between chat start and chat end
      >
        <div className="chat-footer text-xs opacity-50">{message.val.date}</div>
        <div className="chat-bubble text-left break-all">
          {message.val.messageString}
        </div>
        <div>
          <img src={message.val.url} alt={message.val.name} />
        </div>
      </li>
    ));

    return (
      <div className="mb-10">
        <ol className="">{messageListItems}</ol>
      </div>
    );
  }
}
