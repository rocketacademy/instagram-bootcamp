import React from "react";
import { onChildAdded, ref } from "firebase/database";
import { database } from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
const DB_MESSAGES_KEY = "messages";

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Initialise empty messages array in state to keep local state in sync with Firebase
      // When Firebase changes, update local state, which will update local UI
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
      <div key={message.key}>
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Img
              variant="top"
              src={message.val.url && message.val.url}
              alt={message.val.name}
            />
            <Card.Text>{message.val.text}</Card.Text>
            <Card.Text className="date">{message.val.date}</Card.Text>
          </Card.Body>
        </Card>
        <br />
      </div>
    ));
    return <div>{messageListItems}</div>;
  }
}
export default Feed;
