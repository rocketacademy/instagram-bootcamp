import React from "react";
import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";

// styling
import "./InstagramFeed.css";
import Card from "react-bootstrap/Card";

const DB_MESSAGES_KEY = "messages";

class InstagramFeed extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
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

    let messageListItems = this.state.messages.map((message) => (
      <div className="card-feed">
        <Card
          border="light"
          bg="light"
          key={message.key}
          className="card"
          // style={{ width: "24rem" }}
        >
          <Card.Header as="h4">Post</Card.Header>
          <Card.Body>
            <Card.Text className="card-text">
              {" "}
              Description: {message.val.message} <br />
            </Card.Text>
          </Card.Body>
          <Card.Img
            src={message.val.url}
            alt={message.val.message}
            className="card-image"
          />
          <Card.Footer className="text-muted">
            {" "}
            Date:{message.val.date} - {message.val.time}
          </Card.Footer>
        </Card>
      </div>
    ));
    messageListItems.reverse();
    return messageListItems;
  }
}

export default InstagramFeed;
