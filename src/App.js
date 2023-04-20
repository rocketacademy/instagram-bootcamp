import React from "react";
import "./App.css";

// Firebase tools
import { database, storage, auth } from "./firebase";
import {
  onChildAdded,
  onChildRemoved,
  push,
  remove,
  ref,
  update,
} from "firebase/database";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getDownloadURL,
  ref as storeRef,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

// Components
import Post from "./Components/Post/Post";
import SignUpForm from "./Components/SignUp";
import PostComposer from "./Components/PostComposer";

// Firebase paths
const DB_POSTS_KEY = "posts";
const DB_IMAGES_KEY = "images";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty posts array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
      input: "",
      file: null,
      uid: null,
      userEmail: null,
    };
  }

  componentDidMount() {
    const postsRef = ref(database, DB_POSTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering posts
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
    onChildRemoved(postsRef, (data) => {
      const remainingPosts = this.state.posts.filter(
        (posts) => posts.key !== data.key
      );
      this.setState({
        posts: remainingPosts,
      });
    });
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        this.setState({
          uid: uid,
          userEmail: user.email,
        });
      }
    });
  }

  writeData = (message, file) => {
    const postListRef = ref(database, DB_POSTS_KEY);
    const date = new Date();
    const postLog = {
      creator: "Anonymous",
      uid: null,
      content: message,
      date: JSON.stringify(date),
      likes: 0,
    };
    if (this.state.userEmail) {
      postLog.creator = this.state.userEmail;
      postLog.uid = this.state.uid;
    }
    if (file) {
      const imageRef = storeRef(storage, `${DB_IMAGES_KEY}/${file.name}`);
      //Images upload
      uploadBytesResumable(imageRef, file).then(() => {
        getDownloadURL(imageRef).then((url) => {
          postLog.imgURL = url;
          push(postListRef, postLog);
        });
      });
    } else {
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
    const post = e.target.parentElement;
    const id = post.id;
    const postRef = ref(database, `${DB_POSTS_KEY}/${id}`);
    if (post.querySelector(".post-image")) {
      const imgURL = post.querySelector(".post-image").src;
      const imageRef = storeRef(storage, imgURL);
      deleteObject(imageRef);
    }
    remove(postRef);
  };

  handleLikes = (e) => {
    const id = e.target.offsetParent.id;
    const postRef = DB_POSTS_KEY + "/" + id;
    const likedPost = this.state.posts.filter((posts) => posts.key === id)[0];
    const index = this.state.posts.indexOf(likedPost);
    likedPost.val.likes += 1;
    update(ref(database), { [postRef]: likedPost.val });
    const postCopy = [...this.state.posts];
    postCopy.splice(index, 1, likedPost);
    this.setState({
      posts: postCopy,
    });
  };

  handleSignUp = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password);
  };

  handleLogIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password);
  };

  handleLogOut = () => {
    signOut(auth);
    this.setState({
      uid: null,
      userEmail: null,
    });
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.posts.scrollIntoView({ behavior: "smooth" });
  };

  render() {
    let messageListItems = this.state.posts.map((message) => (
      <Post
        key={message.key}
        handleDelete={this.handleDelete}
        handleLikes={this.handleLikes}
        creator={message.val.creator}
        uid={this.state.uid}
      >
        {message}
      </Post>
    ));
    return (
      <div className="App">
        <div className="phone">
          <div id="header">
            <h1>Instasham</h1>
            {this.state.uid ? (
              <div>
                <p>{this.state.userEmail}</p>
                <button onClick={this.handleLogOut}>Log Out</button>
              </div>
            ) : (
              <SignUpForm
                handleSignUp={this.handleSignUp}
                handleLogIn={this.handleLogIn}
              />
            )}
          </div>

          <ul className="posts">
            {messageListItems}
            <li
              ref={(e) => {
                this.posts = e;
              }}
            ></li>
          </ul>
          <PostComposer
            handleSubmit={this.handleSubmit}
            handleFileChange={this.handleFileChange}
            handleChange={this.handleChange}
            file={this.state.file}
            input={this.state.input}
          />
        </div>
      </div>
    );
  }
}

export default App;
