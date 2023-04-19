import React from "react";
import {
  onChildAdded,
  onChildRemoved,
  push,
  remove,
  ref,
} from "firebase/database";
import { database, storage } from "./firebase";
import "./App.css";
import { Post } from "./Components/Post";
import {
  getDownloadURL,
  ref as storeRef,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";
const DB_IMAGES_KEY = "images";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      input: "",
      file: null,
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_POSTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
    onChildRemoved(messagesRef, (data) => {
      const remainingMessages = this.state.messages.filter(
        (messages) => messages.key !== data.key
      );
      this.setState({
        messages: remainingMessages,
      });
    });
  }

  writeData = (message, file) => {
    const postListRef = ref(database, DB_POSTS_KEY);
    const date = new Date();
    if (file) {
      const imageRef = storeRef(storage, `${DB_IMAGES_KEY}/${file.name}`);
      //Images upload
      uploadBytesResumable(imageRef, file).then(() => {
        getDownloadURL(imageRef).then((url) => {
          const postLog = {
            content: message,
            imgURL: url,
            date: JSON.stringify(date),
          };
          push(postListRef, postLog);
        });
      });
    } else {
      const postLog = {
        content: message,
        date: JSON.stringify(date),
      };
      push(postListRef, postLog);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    await this.writeData(this.state.input, this.state.file);
    this.setState({
      input: "",
      file: null,
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
    });
  };

  handleDelete = (e) => {
    const id = e.target.parentElement.id;
    const imgURL = e.target.parentElement.querySelector("img").src;
    const postRef = ref(database, `${DB_POSTS_KEY}/${id}`);
    const imageRef = storeRef(storage, imgURL);
    remove(postRef);
    deleteObject(imageRef);
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  render() {
    let messageListItems = this.state.messages.map((message) => (
      <Post key={message.key} handleDelete={this.handleDelete}>
        {message}
      </Post>
    ));
    return (
      <div className="App">
        <div className="phone">
          <ul className="posts">
            {messageListItems}
            <li
              ref={(e) => {
                this.messagesEnd = e;
              }}
            ></li>
          </ul>
          <form onSubmit={this.handleSubmit}>
            <label
              htmlFor="image-upload"
              className={`image-upload ${this.state.file && "complete"}`}
            >
              {this.state.file ? "✓" : "+"}
            </label>
            <input
              id="image-upload"
              type="file"
              onChange={this.handleFileChange}
            />
            <input
              name="input"
              type="text"
              value={this.state.input}
              onChange={this.handleChange}
              autoComplete="off"
              placeholder="Type here"
            />

            <input type="submit" value="⬆" />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
