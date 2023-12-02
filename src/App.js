import React from "react";
import { onChildAdded, onChildChanged, ref, update } from "firebase/database";
import { database } from "./firebase";
import "./App.css";
import Posts from "./Component/Posts";
import Clock from "./Component/Clock";
import Composer from "./Component/Composer";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
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
          <Composer posts={this.state.posts} />
        </header>
      </div>
    );
  }
}

export default App;
