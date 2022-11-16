import { onValue, ref as databaseRef } from "firebase/database";
import React, { useEffect, useState } from "react";

import { database } from "../firebase";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { PostDisplay } from "./PostDisplay";

// Save Firebase folder names as constants to avoid bugs due to misspelling
const POSTS_FOLDER_NAME = "posts";

export function NewsFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsRef = databaseRef(database, POSTS_FOLDER_NAME);
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();

      console.log(Object.values(data));
      setPosts(Object.values(data));
    });
  }, []);

  let postCards = posts.map((post) => (
    <PostDisplay
      key={posts.indexOf(post)}
      authorEmail={post.authorEmail}
      text={post.text}
      imageLink={post.imageLink}
    />
  ));
  // Reverse the order of posts such that newest posts are on top
  postCards.reverse();

  return (
    <Col className="p-4">
      <h3>Posts</h3>

      <Row>{postCards}</Row>
    </Col>
  );
}
