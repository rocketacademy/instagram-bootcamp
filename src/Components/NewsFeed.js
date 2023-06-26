import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { database, storage } from "../firebase";
import {
  ref as databaseRef,
  remove,
  onChildAdded,
  onChildRemoved,
  update,
} from "firebase/database";
import { useState, useEffect } from "react";

const POST_KEY = "posts";

function NewsFeed({ loggedInUser }) {
  const [posts, setPosts] = useState([]);
  const [userLikes, setUserLikes] = useState({});

  useEffect(() => {
    const postRef = databaseRef(database, POST_KEY);
    onChildAdded(postRef, (data) => {
      setPosts((state) => [...state, { key: data.key, val: data.val() }]);
      setUserLikes((likes) => ({
        ...likes,
        [data.key]: data.val().likes || {},
      }));
    });
  }, []);

  useEffect(() => {
    const postRef = databaseRef(database, POST_KEY);
    onChildRemoved(postRef, (removedOldData) => {
      const postsCopy = [...posts];
      const newPosts = postsCopy.filter(
        (post) => post.key !== removedOldData.key
      );
      setPosts(newPosts);
    });
  }, [posts]);

  useEffect(() => {
    // Update userLikes state when the loggedInUser changes
    setUserLikes((prevUserLikes) => ({
      ...prevUserLikes,
      [loggedInUser]: prevUserLikes[loggedInUser] || {},
    }));
  }, [loggedInUser]);

  const handleLikeButton = (postKey) => {
    const liked = userLikes[postKey]?.[loggedInUser] || false;

    // Toggle the like status for the logged-in user and the specific post
    const updatedLikes = {
      ...userLikes,
      [postKey]: {
        ...userLikes[postKey],
        [loggedInUser]: !liked,
      },
    };
    setUserLikes(updatedLikes);

    // Calculate the new like count for the post
    const likeCount = Object.values(updatedLikes[postKey]).filter(
      Boolean
    ).length;

    const postLikeRef = databaseRef(database, `${POST_KEY}/${postKey}`);
    update(postLikeRef, {
      likes: updatedLikes[postKey],
      likeCount: likeCount,
    });
  };

  let postItems = posts.map((post) => {
    const likes = userLikes[post.key] || {};
    const likeCount = Object.values(likes).filter(Boolean).length;

    return (
      <Card key={post.key}>
        {post.val.url ? (
          <>
            <Card.Img variant="top" src={post.val.url} className="Card-img" />
            <Button variant="white" onClick={() => handleLikeButton(post.key)}>
              ❤ {likeCount}
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
              const imageDeletionRef = storageRef(storage, post.val.imageRef);
              deleteObject(imageDeletionRef).then(() => {
                console.log("image deleted");
              });

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
    );
  });

  return (
    <div>
      <ol>{postItems.reverse()}</ol>
    </div>
  );
}

export default NewsFeed;
