import { useState, useEffect } from "react";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";

// Save the Firebase post folder name as a constant to avoid bugs due to misspelling
const POST_KEY = "posts";

function NewsFeed({ email }) {
  // Initialise empty posts array in state to keep local state in sync with Firebase
  // When Firebase changes, update local state, which will update local UI
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postRef = databaseRef(database, POST_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postRef, (data) => {
      console.log(data);
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setPosts((state) =>
        // Store posts key so we can use it as a key in our card items when rendering posts
        [...state, { key: data.key, val: data.val() }]
      );
    });
  }, []);

  console.log(posts);
  // Convert posts in state to JSX elements to render
  let postItems = posts.map((post) => (
    <Card key={post.key}>
      {post.val.url ? (
        <>
          <Card.Img variant="top" src={post.val.url} className="Card-img" />{" "}
          <Button variant="white" onClick={onclick}>
            ❤ {post.val.likeCount}
          </Button>
        </>
      ) : (
        <p>No images</p>
      )}

      <Card.Body>
        <Card.Title>Author: {post.val.email}</Card.Title>
        <Card.Text>Date: {post.val.date} </Card.Text>
        <Card.Text>{post.val.textInput} </Card.Text>
      </Card.Body>
    </Card>
  ));

  return (
    <div>
      <ol>{postItems.reverse()}</ol>
    </div>
  );
}

export default NewsFeed;
