import React from "react";
import Button from "react-bootstrap/Button";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "./firebase";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class Post extends React.Component {
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
      <Card bg="dark" text="white" key={message.key}>
        {message.val.url ? (
          <Card.Img className="image" src={message.val.url} alt="image" />
        ) : (
          <Card.Text>"No images"</Card.Text>
        )}
        <Card.Body>
          <Card.Text>{message.val.text}</Card.Text>
          <Button onSubmit={this.handleLikes}>Likes</Button>
        </Card.Body>
      </Card>
    ));

    return (
      <div className="App-header">
        <div className="grid">{messageListItems.reverse()}</div>
      </div>
    );
  }
}

export default Post;
