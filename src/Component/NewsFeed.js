import React from "react";
import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";

// Save the Firebase post folder name as a constant to avoid bugs due to misspelling
const DB_POST_FOLDER_NAME = "post";

export default class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty posts array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
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

  render() {
    // Convert posts in state to post JSX elements to render
    let postListItems = this.state.posts.map((post) => (
      <p>
        {post.val.url ? (
          <img src={post.val.url} alt={post.val.name} />
        ) : (
          <p>No image</p>
        )}{" "}
        <br />
        {post.val.post} <br />
        {post.val.date} - {post.val.time} <br />
      </p>
    ));
    return <p>{postListItems}</p>;
  }
}
