import React from "react";
import { realTimeDatabase } from "../firebase";
import { onChildAdded, ref as realTimeDatabaseRef } from "firebase/database";

class Newsfeed extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
    };
  }
  componentDidMount() {
    const messagesRef = realTimeDatabaseRef(
      realTimeDatabase,
      this.props.DB_MESSAGES_KEY
    );
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
    let messageListItems = this.state.messages.map((message) => (
      <div>
        <li key={message.key}>
          {/* Render each part of message in separate lines */}
          <span>Name: {message.val.name}</span>
          <br />
          <span>Message: {message.val.message}</span>
          <br />
          <span>DateTime: {message.val.dateTime}</span>
          <br />
          {message.val.url ? (
            <img
              className="postImage"
              src={message.val.url}
              alt={message.val.name}
            />
          ) : (
            <p>No images</p>
          )}
        </li>
        <br />
      </div>
    ));
    return <ol>{messageListItems}</ol>;
  }
}

export default Newsfeed;
