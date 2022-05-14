import { onChildAdded, ref as databaseRef } from "firebase/database";
import React from "react";
import Card from "react-bootstrap/Card";
import "./NewsFeed.css";
import { database } from "../firebase";

// Save Firebase folder names as constants to avoid bugs due to misspelling
const POSTS_FOLDER_NAME = "posts";

class Composer extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty posts array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    const postsRef = databaseRef(database, POSTS_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store post key so we can use it as a key in our list items when rendering posts
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  render() {
    // Convert posts in state to post JSX elements to render
    let postCards = this.state.posts.map((post) => (
      <Card bg="dark" key={post.key} className="Card">
        <Card.Img variant="top" src={post.val.imageLink} className="Card-Img" />
        <Card.Text>{post.val.authorEmail}</Card.Text>
        <Card.Text>{post.val.text}</Card.Text>
      </Card>
    ));
    // Reverse the order of posts such that newest posts are on top
    postCards.reverse();
    return postCards;
  }
}

export default Composer;
