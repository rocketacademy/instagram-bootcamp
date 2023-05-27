import React from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";

// import to use methods to access and upload from firebase/storage
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Save the Firebase post folder name as a constant to avoid bugs due to misspelling
const DB_POST_FOLDER_NAME = "post";
const IMAGE_FOLDER_NAME = "images";

export default class Composer extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty posts array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      currPost: "",
      posts: [],
      date: "",
      time: "",
      fileInputFile: null,
      fileInputValue: "",
    };
  }

  componentDidMount() {
    const postRef = ref(database, DB_POST_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store post key so we can use it as a key in our list items when rendering posts
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (url) => {
    const postRef = ref(database, DB_POST_FOLDER_NAME);
    const newPostRef = push(postRef);
    set(newPostRef, {
      post: this.state.currPost,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      url: url,
    });
    this.setState({
      currPost: "",
      date: "",
      time: "",
      fileInputFile: null,
      fileInputValue: "",
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  handleSubmit = (e) => {
    // Prevent default form submit behaviour that will reload the page
    e.preventDefault();

    // Store images in an images folder in Firebase Storage
    const fileRef = storageRef(
      storage,
      ` ${IMAGE_FOLDER_NAME}/${this.state.fileInputFile.name}`
    );
    console.log(` ${IMAGE_FOLDER_NAME}/${this.state.fileInputFile.name}`);

    uploadBytes(fileRef, this.state.fileInputFile).then((snapshot) => {
      getDownloadURL(fileRef).then((url) => {
        this.writeData(url);
      });
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="currPost"
          value={this.state.currPost}
          placeholder="Input your post"
          onChange={(e) => this.handleChange(e)}
        />
        <br />
        <input
          type="file"
          name="file"
          value={this.state.fileInputValue}
          onChange={(e) => {
            this.setState({
              fileInputFile: e.target.files[0],
              fileInputValue: e.target.value,
            });
          }}
        />
        <input type="submit" name="submit" />
      </form>
    );
  }
}
