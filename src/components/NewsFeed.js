import React, { useEffect, useState } from "react";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";
import "./NewsFeed.css";
import Card from "react-bootstrap/Card";

const POSTS_FOLDER_NAME = "posts";

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsRef = databaseRef(database, POSTS_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      const value = data.val();
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setPosts((state) => [
        ...state,
        {
          key: data.key,
          image: value.imageLink,
          author: value.authorEmail,
          caption: value.text,
        },
      ]);
    });
  }, []);

  let postCards = posts.map((post) => (
    <Card key={post.key} className="Card">
      <Card.Img variant="top" src={post.image} className="Card-Img" />
      <Card.Text>Title: {post.caption}</Card.Text>
      <Card.Text>Author: {post.author}</Card.Text>
    </Card>
  ));
  postCards.reverse();
  return postCards;
};

export default NewsFeed;
