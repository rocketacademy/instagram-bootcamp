import React from "react";

import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";

const DB_MESSAGES_KEY = "messages";

export default class MessageList extends React.Component {
  constructor() {
    super();
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
    return (
      <div>
        <ol>
          {this.state.messages && this.state.messages.length > 0 ? (
            this.state.messages.map((messageItem) => (
              <li key={messageItem.key}>
                <div>
                  <h3>{messageItem.val.message}</h3>
                  <p>{messageItem.val.date}</p>
                </div>
              </li>
            ))
          ) : (
            <p>No Messages Yet</p>
          )}
        </ol>
      </div>
    );
  }
}
