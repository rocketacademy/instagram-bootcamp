import React from "react";
import { onChildAdded, ref } from "firebase/database";
import { database } from "./firebase";
// import { auth } from "./firebase";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
import PostForm from "./PostForm";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      // inputValue: "",
      // fileInputFile: null,
      // fileInputValue: "",
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
      <p key={message.key}>
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
      </p>
    ));
    return (
      <div className="App">
        <header>Rocketgram</header>

        <PostForm />

        <div>{messageListItems}</div>
      </div>
    );
  }
}

export default App;
