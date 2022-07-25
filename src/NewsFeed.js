import React from "react";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "./firebase";
import "./NewsFeed.css";
import Card from "react-bootstrap/Card";

const POSTS_FOLDER_NAME = "posts";

class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
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
        // Store message key so we can use it as a key in our list items when rendering messages
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  render() {
    // Convert messages in state to message JSX elements to render
    let postCards = this.state.posts.map((post) => (
      <Card key={post.key} className="Card">
        <Card.Img variant="top" src={post.val.imageLink} className="Card-Img" />
        <Card.Text>Title: {post.val.text}</Card.Text>
        <Card.Text>Author: {post.val.authorEmail}</Card.Text>
      </Card>
    ));
    postCards.reverse();
    return postCards;
  }
}

export default NewsFeed;
