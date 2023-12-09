import React from "react";
import { onChildAdded, push, ref, set, update } from "firebase/database";
import { database, storage } from "./firebase";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

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

  handleLike = (messageKey) => {
    const user = this.props.loggedInUser;

    if (!user) {
      alert("please sign in first");
    }

    const likedMessage = this.state.messages.find(
      (message) => message.key === messageKey
    );
    //check if user liked the post
    const likedByUser = likedMessage.val.likes[user.uid];

    const likesRef = ref(
      database,
      DB_MESSAGES_KEY + "/" + messageKey + "/likes"
    );
    //unlike
    if (likedByUser) {
      update(likesRef, {
        [user.uid]: null,
      });
    }
    //if like
    else {
      update(likesRef, {
        [user.uid]: true,
      });
    }
  };

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
          <Card.Text>{message.val.email}</Card.Text>
          <div className="like-container">
            <Button onClick={() => this.handleLike(message.key)}>
              Like/Unlike
            </Button>
            <p>
              Likes:
              {message.val.likes ? Object.keys(message.val.likes).length : 0}
            </p>
          </div>
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
