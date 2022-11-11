import React, { useState, useEffect } from "react";
import { onChildAdded, ref as databaseRef, push, set } from "firebase/database";
import { database } from "../firebase";
import "./App.css";
import Card from "react-bootstrap/Card";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Button } from "react-bootstrap";

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [toggleLike, setToggleLike] = useState(false);
  const [countLike, setCountLike] = useState(0);

  const POSTS_FOLDER_NAME = "posts";
  const LIKES_FOLDER_NAME = "likes";

  const postRef = databaseRef(database, POSTS_FOLDER_NAME);

  useEffect(() => {
    // onChildAdded will return data for every child at the reference and every subsequent new child
    const post = [];
    onChildAdded(postRef, (data) => {
      post.push({ key: data.key, val: data.val() });
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setPosts([...post]);
    });
  }, []);
  // Note use of array fields syntax to avoid having to manually bind this method to the class

  const handleClick = (postid) => {
    const likeRecordRef = databaseRef(database, LIKES_FOLDER_NAME);
    const newLikeRef = push(likeRecordRef);
    setToggleLike(true) && setCountLike(countLike + 1);
    if (toggleLike) {
      setToggleLike(false) && setCountLike(countLike - 1);
    }
    set(newLikeRef, { toggle: toggleLike, count: countLike, postid: "" });
  };

  const postListItems = posts.map((post) => (
    <div className="container">
      <Card key={post.key} className="post">
        <Card.Img variant="top" src={post.val.imageLink} className="image" />
        <Card.Body>
          <Card.Text>
            Post Date:{" "}
            {new Date().toLocaleString("en-GB", { timeZone: "Japan" })}
          </Card.Text>
          {/* <Card.Text>{post.val.authorEmail}</Card.Text> */}
          <Card.Text>{post.val.text}</Card.Text>
          <Button onClick={() => handleClick(post.id)}>
            {post.val.toggle ? AiOutlineHeart : AiFillHeart}
          </Button>
          <Card.Text>{post.val.count}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  ));

  return <div>{postListItems}</div>;
};

export default NewsFeed;
