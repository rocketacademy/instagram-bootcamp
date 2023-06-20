import React from "react";

import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
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

    onChildAdded(messagesRef, (data) => {
      this.setState((state) => ({
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
                  <h4>
                    {messageItem.val.date} - {messageItem.val.userID}
                  </h4>
                  <p>{messageItem.val.message}</p>
                </div>
              </li>
            ))
          ) : (
            <p>No messages yet</p>
          )}
        </ol>
      </div>
    );
  }
}
