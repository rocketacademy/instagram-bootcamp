import React from "react";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  update,
} from "firebase/database";
import { database, storage } from "./firebase";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORE_FILES_KEY = "files";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      messageInput: "",
      fileInput: null,
      fileInputValue: "",
      isMessageLiked: false,
      numberOfLikes: 0,
    };
  }

  componentDidMount() {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  // writeData = () => {
  //   const messageListRef = ref(database, DB_MESSAGES_KEY);
  //   const newMessageRef = push(messageListRef);
  //   set(newMessageRef, "abc");
  // };

  handleMessageInputChange = (e) => {
    const { value } = e.target;
    this.setState({
      messageInput: value,
    });
  };

  handleFileInputChange = (e) => {
    this.setState({
      fileInput: e.target.files[0],
      fileInputValue: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const fileRef = storageRef(
      storage,
      `${STORE_FILES_KEY}/${this.state.fileInput.name}`
    );

    // Trying to add date (unsuccessfully)
    // const newMessageRef = push(messageListRef);
    // console.log("newMessageRef: ", newMessageRef);

    // console.log(timestamp.toLocaleString("en-GB").slice(0, -3));

    uploadBytesResumable(fileRef, this.state.fileInput).then(() => {
      getDownloadURL(fileRef).then((url) => {
        const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
        const newMessageRef = push(messageListRef);
        const timestamp = new Date();
        const newMessage = {
          text: this.state.messageInput,
          timestamp: timestamp.toLocaleString("en-GB").slice(0, -3),
          fileLink: url,
          likes: this.state.numberOfLikes,
        };
        set(newMessageRef, newMessage).then(() => {
          this.setState({
            messageInput: "",
            fileInput: null,
            fileInputValue: "",
            isMessageLiked: false,
          });
        });
      });
    });

    // push(messageListRef, newMessage);
  };

  // TODO: Fix like button
  // Only incrementing on refresh
  handleLikeClick = (e) => {
    console.log("Add a like");
    const { id } = e.target;
    console.log(id);
    const incrementLikes = this.state.numberOfLikes + 1;
    this.setState({
      isMessageLiked: true,
      numberOfLikes: incrementLikes,
    });

    const likesRef = databaseRef(database, `${DB_MESSAGES_KEY}/${id}`);
    const updatedLikes = { likes: incrementLikes };
    update(likesRef, updatedLikes);

    // handleDislikeClick = () => {
    //   console.log("Remove a like");
    //   const decrementLikes = this.state.numberOfLikes - 1;
    //   this.setState({
    //     isPostLiked: false,
    //     numberOfLikes: decrementLikes,
    //   });
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <div>
        <li key={message.key}>{message.val.text}</li>
        <p>{message.val.timestamp}</p>
        <img
          src={message.val.fileLink}
          alt="beautiful sunset"
          width="50vw"
          height="30vh"
        />
        <button
          id={message.key}
          value={this.state.isMessageLiked}
          onClick={this.handleLikeClick}
        >
          👍 {message.val.likes}
        </button>
        {/* <button
          id="dislikeButton"
          value={this.state.isPostDisliked}
          onClick={this.handleDislikeClick}
        >
          👎
        </button> */}
      </div>
    ));
    messageListItems.reverse();
    return (
      <div className="App">
        <header className="App-header">
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form onSubmit={this.handleSubmit}>
            <input
              id="fileInput"
              type="file"
              value={this.state.fileInputValue}
              onChange={this.handleFileInputChange}
            />
            <br />
            <input
              type="text"
              id="messageInput"
              value={this.state.messageInput}
              placeholder="Type something..."
              onChange={this.handleMessageInputChange}
            />
            <input
              type="submit"
              value="➤"
              disabled={!this.state.messageInput}
            />
            <br />

            {/* <button onClick={this.writeData}>Send</button> */}
          </form>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
  }
}

export default App;
