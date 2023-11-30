import React from "react";
import {
  onChildAdded,
  onChildChanged,
  push,
  ref,
  set,
  update,
} from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "./firebase";
import "./App.css";
import Posts from "./Posts";
import Clock from "./Clock";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
      input: "",
      inputFile: null,
      inputFileValue: "",
    };
  }

  componentDidMount() {
    const postsRef = ref(database, DB_POSTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
    onChildChanged(postsRef, (data) => {
      const replace = this.state.posts.toSpliced(data.val().postNo, 1, {
        key: data.key,
        val: data.val(),
      });
      this.setState({ posts: replace });
    });
  }

  handleSumbit = () => {
    if (this.state.inputFile === null) {
      this.writeData(null);
      return;
    }
    const imgRef = storageRef(
      storage,
      this.state.inputFile.name + this.state.posts.key
    );
    uploadBytes(imgRef, this.state.inputFile).then(() => {
      getDownloadURL(imgRef).then((url) => this.writeData(url));
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    const postsListRef = ref(database, DB_POSTS_KEY);
    const newPostRef = push(postsListRef);
    set(newPostRef, {
      postNo: this.state.posts.length,
      message: this.state.input,
      date: new Date().toLocaleString(),
      url: url,
      likes: 0,
    });
    this.setState({ input: "", inputFile: null, inputFileValue: "" });
  };

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  };

  handleLike = (post, isLike) => {
    const postRef = ref(database, DB_POSTS_KEY + "/" + post.key);
    update(postRef, {
      likes: isLike ? post.val.likes + 1 : post.val.likes - 1,
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Posts posts={this.state.posts} handleLike={this.handleLike} />
          <Clock />
          <input
            value={this.state.input}
            onChange={this.handleChange}
            placeholder="Please type in message"
          />
          <input
            type="file"
            value={this.state.inputFileValue}
            onChange={(e) => {
              this.setState({
                inputFile: e.target.files[0],
                inputFileValue: e.target.files[0],
              });
            }}
          />
          <button onClick={this.handleSumbit}>Send</button>
        </header>
      </div>
    );
  }
}

export default App;
