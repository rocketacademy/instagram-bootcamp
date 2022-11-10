import React from "react";
import Card from "react-bootstrap/Card";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";
import "./App.css";

const MESSAGE_FOLDER_NAME = "messages";

class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    const messagesRef = databaseRef(database, MESSAGE_FOLDER_NAME);
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
    return this.state.messages.map((message) => (
      <Card key={message.key}>
        <Card.Img
          className="storage-image"
          src={message.val.imageLink}
          alt="image"
        />
        <Card.Text>
          {message.val.createdAt},{" "}
          <a href="#login">{message.val.authorEmail}</a>
        </Card.Text>
        <Card.Text>→→→ {message.val.text}</Card.Text>
      </Card>
    ));
  }
}

export default NewsFeed;
