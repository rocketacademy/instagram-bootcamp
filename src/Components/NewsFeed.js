import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { database, storage } from "../firebase";
import {
  ref as databaseRef,
  remove,
  onChildAdded,
  onChildRemoved,
} from "firebase/database";
import { useState, useEffect } from "react";

const POST_KEY = "posts";

function NewsFeed() {
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

  useEffect(() => {
    const postRef = databaseRef(database, POST_KEY);
    // Delete the deleted post & image from state so it is no longer rendered
    onChildRemoved(postRef, (removedOldData) => {
      console.log("data onChildRemoved", removedOldData);
      const postsCopy = [...posts];
      const newPosts = postsCopy.filter(
        (post) => post.key !== removedOldData.key
      );
      setPosts(newPosts);
    });
  }, [posts]);

  // Convert posts in state to JSX elements to render
  console.log(posts);
  let postItems = posts.map((post) => (
    <Card key={post.key}>
      {post.val.url ? (
        <>
          <Card.Img variant="top" src={post.val.url} className="Card-img" />
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
        <Button
          variant="dark"
          onClick={(e) => {
            // Delete image from storage
            const imageDeletionRef = storageRef(storage, post.val.imageRef);
            deleteObject(imageDeletionRef).then(() => {
              console.log("image deleted");
            });

            // Delete an entire post from database
            const postDeletionRef = databaseRef(
              database,
              `${POST_KEY}/${post.key}`
            );
            remove(postDeletionRef).then(() => {
              console.log("entire post deleted");
            });
          }}
        >
          Delete
        </Button>
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
