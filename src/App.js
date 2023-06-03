import React from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "./firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import logo from "./logo.png";
import "./App.css";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";

// Save the Firebase post folder name as a constant to avoid bugs due to misspelling
const POST_KEY = "posts";
const STORAGE_KEY = "images/";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty posts array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
      textInput: "",
      fileInputFile: null,
      fileInputValue: "",
      likeClicked: false,
      likeCount: 0,
    };
  }

  componentDidMount() {
    const postRef = databaseRef(database, POST_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postRef, (data) => {
      console.log(data);
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store posts key so we can use it as a key in our card items when rendering posts
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  // Note use of arrow fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    const postRef = databaseRef(database, POST_KEY);
    const newPostRef = push(postRef);
    set(newPostRef, {
      textInput: this.state.textInput,
      date: new Date().toLocaleString(),
      url: url,
      likeCount: this.state.likeCount,
    });

    this.setState({
      textInput: "",
      fileInputFile: null,
      fileInputValue: "",
    });
  };

  handleTextInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleFileInputChange = (e) => {
    console.log(e);
    const { files, value } = e.target;
    this.setState({
      fileInputFile: files[0],
      fileInputValue: value,
    });
  };

  submit = (e) => {
    e.preventDefault();

    const fileStorageRef = storageRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );

    uploadBytes(fileStorageRef, this.state.fileInputFile)
      .then(() => getDownloadURL(fileStorageRef))
      .then((url) => this.writeData(url));
  };

  handleLikeCount = () => {
    this.setState((state) => ({
      likeCount: state.likeClicked ? state.likeCount + 1 : state.likeCount - 1,
    }));
  };

  handleLikeButton = () => {
    this.setState(
      (state) => ({
        likeClicked: !state.likeClicked,
      }),
      () => this.handleLikeCount()
    );
  };

  componentDidUpdate() {
    console.log(this.state.likeClicked);
    console.log(this.state.likeCount);
  }

  render() {
    console.log(this.state.posts);
    console.log(this.state.fileInputFile);
    console.log(this.state.fileInputValue);
    // Convert posts in state to JSX elements to render
    let postItems = this.state.posts.map((post) => (
      <Card key={post.key}>
        {post.val.url ? (
          <>
            <Card.Img variant="top" src={post.val.url} className="Card-img" />{" "}
            <Button variant="white" onClick={this.handleLikeButton}>
              ❤ {post.val.likeCount}
            </Button>
          </>
        ) : (
          <p>No images</p>
        )}

        <Card.Body>
          <Card.Title>{post.val.date}</Card.Title>
          <Card.Text>{post.val.textInput} </Card.Text>
        </Card.Body>
      </Card>
    ));

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <form onSubmit={this.submit}>
            <label>Submit your thoughts below: </label>
            <br />
            <input
              type="text"
              name="textInput"
              value={this.state.textInput}
              onChange={this.handleTextInputChange}
            />
            <br />
            <input
              type="file"
              name="file"
              value={this.state.fileInputValue}
              onChange={this.handleFileInputChange}
            />
            <br />
            <button>Send</button>
          </form>
          <ol>{postItems.reverse()}</ol>
        </header>
      </div>
    );
  }
}

export default App;
