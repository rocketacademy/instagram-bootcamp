import React from "react";
import {
  onChildAdded,
  onChildRemoved,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { database, storage } from "./firebase";
import {
  ref as storeRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";
const STORE_IMAGE_KEY = "images";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty posts array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
      inputMessage: "",
      file: null,
    };
  }

  componentDidMount() {
    const postsRef = ref(database, DB_POSTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store post key so we can use it as a key in our list items when rendering posts
        posts: [
          ...state.posts,
          {
            key: data.key,
            text: data.val().text,
            date: data.val().date,
            imgURL: data.val().imgURL,
            imgID: data.val().imgID,
          },
        ],
      }));
    });
    onChildRemoved(postsRef, (removedPost) => {
      const remainingPosts = this.state.posts.filter((post) => {
        return post.key !== removedPost.key;
      });
      this.setState({
        posts: remainingPosts,
      });
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (callback) => {
    const postListRef = ref(database, DB_POSTS_KEY);
    // push creates a key for the new post in the database
    const newPostRef = push(postListRef);
    console.log("newPostRef: ", newPostRef);
    const currentDate = new Date();
    // if there is a file upload
    if (this.state.file) {
      // make each imgID unique based on the date
      const imgID = this.state.file.name + JSON.stringify(new Date());
      const fileRef = storeRef(storage, `${STORE_IMAGE_KEY}/${imgID}`);
      uploadBytesResumable(fileRef, this.state.file).then(() => {
        getDownloadURL(fileRef).then((url) => {
          set(newPostRef, {
            text: this.state.inputMessage,
            date: currentDate.toLocaleString("en-GB").slice(0, -3),
            imgURL: url,
            imgID: imgID,
          });
          callback();
        });
      });
    } else {
      set(newPostRef, {
        text: this.state.inputMessage,
        date: currentDate.toLocaleString("en-GB").slice(0, -3),
      });
      callback();
    }
  };

  handleInputSubmit = (e) => {
    e.preventDefault();
    console.log("e: ", e);
    e.target[0].value = null;
    const finishDataWrite = new Promise((resolve) => {
      console.log("Promise created");
      this.writeData(resolve);
    });
    finishDataWrite.then(() => {
      console.log("Executing setState"); // this never runs because the promise is not set up correctly
      // reset input text form after submitting
      this.setState({
        inputMessage: "",
        file: null,
      });
    });
  };

  handleInputChange = (e) => {
    this.setState({
      inputMessage: e.target.value,
    });
  };

  handleFileChange = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      file: e.target.files[0],
    });
  };

  handleDelete = (e) => {
    const id = e.target.id;
    const postRef = ref(database, `${DB_POSTS_KEY}/${id}`);
    remove(postRef);
    const imgID = e.target.getAttribute("img-id");
    if (imgID) {
      const imageRef = storeRef(
        storage,
        `${STORE_IMAGE_KEY}/${e.target.getAttribute("img-id")}`
      );
      deleteObject(imageRef);
    }
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let postListItems = this.state.posts.map((post) => (
      <div key={post.key} className="post-bubble">
        {post.imgURL && <img src={post.imgURL} alt="user-content" />}
        <div>{post.text}</div>
        <div className="post-date">{post.date}</div>
        <button onClick={this.handleDelete} id={post.key} img-id={post.imgID}>
          Delete
        </button>
      </div>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.handleInputSubmit}>
            <div>
              <input type="file" onChange={this.handleFileChange}></input>
            </div>
            <input
              type="text"
              onChange={this.handleInputChange}
              value={this.state.inputMessage}
            ></input>

            <input type="submit" value="Send"></input>
          </form>

          <div className="post-container">{postListItems}</div>
        </header>
      </div>
    );
  }
}

export default App;
