import React from "react";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";
import Card from "react-bootstrap/Card";

const POSTS_FOLDER_NAME = "posts";

export default class InstagramFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    const postRef = databaseRef(database, POSTS_FOLDER_NAME);
    onChildAdded(postRef, (data) => {
      this.setState((state) => ({
        posts: [...state.posts, { key: data.key, val: data.val() }],
      }));
    });
  }

  render() {
    let instagramFeed = this.state.posts.map((post) => (
      <Card bg="dark" key={post.key}>
        <Card.Img src={post.val.imageLink} />
        <Card.Text>{post.val.authorEmail}</Card.Text>
        <Card.Text>{post.val.text}</Card.Text>
      </Card>
    ));
    return instagramFeed;
  }
}
