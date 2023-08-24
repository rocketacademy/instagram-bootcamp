import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { database } from "../firebase";
import { onChildAdded, ref as databaseRef } from "firebase/database";

const POSTS_FOLDER_NAME = "posts";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsRef = databaseRef(database, POSTS_FOLDER_NAME);
    const unsubscribe = onChildAdded(postsRef, (data) => {
      setPosts((prevPosts) => [
        ...prevPosts,
        { key: data.key, val: data.val() },
      ]);
    });

    return () => unsubscribe();
  }, []);

  let postCards = posts.map((post) => (
    <Card key={post.key} bg="dark" text="light" className="post-card">
      <Card.Img
        variant="top"
        src={post.val.imageLink}
        className="max-height-image"
      />
      <Card.Body>
        <Card.Text className="card-author-email">
          {post.val.authorEmail}
        </Card.Text>
        <Card.Text className="card-text">{post.val.text}</Card.Text>
      </Card.Body>
    </Card>
  ));

  //postCards.reverse();

  return <div className="horizontal-scrollable-card-deck">{postCards}</div>;
}
