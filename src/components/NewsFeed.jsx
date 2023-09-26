import React, { useEffect, useState } from "react";
//This line is importing specific functions from the Firebase Realtime Database library that you need to work with the database.
import {
  onChildAdded,
  ref as databaseRef,
  get,
  set,
  push,
} from "firebase/database";
// Import Firebase database instance
import { database } from "../firebase";
// Import TextField for comment input
// Import Button for comment submission
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  CardHeader,
  Avatar,
  TextField,
  Button,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const DB_LOGGED_IN_USER_KEY = "logged_in_user";
const DB_POST_KEY = "insta-post";
//const DB_PROFILE_KEY = "profile-data";
//const STORAGE_KEY = "post/";

export default function NewsFeed() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loggedInUser, setLoggedInUser] = useState([]);

  useEffect(() => {
    const loggedInUserRef = databaseRef(database, DB_LOGGED_IN_USER_KEY);
    onChildAdded(loggedInUserRef, (data) => {
      setLoggedInUser((prevData) => [
        ...prevData,
        { key: data.key, val: data.val() },
      ]);
    });

    //we are creating a reference (messagesRef) to a specific location in the Firebase database.
    //ref(database, DB_MESSAGES_KEY);: The ref function is used to create a reference to a specific location in your Firebase database.
    //Here, `database` is the reference to the entire database, and `DB_MESSAGES_KEY` is a constant representing the key for a specific location in the database, which is where messages are stored.
    const postListRef = databaseRef(database, DB_POST_KEY);
    //onChildAdded(messagesRef, (data) => {...});: This function sets up a listener for when a new child (like a new message) is added to the specified location in the database (in this case, messagesRef).
    //The (data) => {...} part is a callback function that gets executed whenever a new child is added. It's within this callback that you'll handle what happens when a new message is added.
    onChildAdded(postListRef, (data) => {
      //Inside the callback function, we are using the setMessages function,
      //This function takes the previous state of the messages array (retrieved from useState) and appends a new message to it.
      // The new message is an object with two properties: key and val. The key is the unique identifier for the message in the database, and val is the actual content of the message.
      setPosts((prevPost) => [...prevPost, { key: data.key, val: data.val() }]);
    });
  }, []);

  console.log("loggedInUser:", loggedInUser);
  console.log("posts:", posts);

  const handleLike = (postKey) => {
    // Check if the post is already liked
    const isLiked = likedPosts.includes(postKey);

    if (isLiked) {
      // Remove the post from the likedPosts array
      setLikedPosts(likedPosts.filter((key) => key !== postKey));
    } else {
      // Add the post to the likedPosts array
      setLikedPosts([...likedPosts, postKey]);
    }

    // Create a reference to the specific post in the Firebase database
    const postRef = databaseRef(database, `${DB_POST_KEY}/${postKey}`);

    // Use the get function to read data from the postRef
    get(postRef)
      .then((snapshot) => {
        const currentData = snapshot.val();

        // Update the likes count based on the current data
        const newData = {
          ...currentData,
          likes: isLiked ? currentData.likes - 1 : currentData.likes + 1,
        };

        // Update the post data using set method
        set(postRef, newData);

        // Update the local state with the new like count
        setPosts((prevPosts) => {
          return prevPosts.map((post) => {
            if (post.key === postKey) {
              post.val.likes = newData.likes;
            }
            return post;
          });
        });
      })
      .catch((error) => {
        // Handle any errors that might occur
        console.error("Error reading post data:", error);
      });
  };

  const handleCommentSubmit = (postKey) => {
    if (commentText.trim() === "") {
      return;
    }

    // Create a reference to the comments section of the specific post in the Firebase database
    const commentsRef = databaseRef(
      database,
      `${DB_POST_KEY}/${postKey}/comments`
    );

    // Push a new comment to the comments section
    const newCommentRef = push(commentsRef);
    const newComment = {
      username: loggedInUser[0].val.username, // Replace with the actual username of the commenter
      profilePicture: loggedInUser[0].val.profilePicture, // Replace with the actual profile picture URL
      text: commentText,
    };

    // Update the local state immediately with the new comment
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.map((post) => {
        if (post.key === postKey) {
          if (!post.val.comments) {
            post.val.comments = {};
          }
          // Add the new comment to the post's comments
          post.val.comments[newCommentRef.key] = newComment;
        }
        return post;
      });
      return updatedPosts;
    });

    setCommentText(""); // Clear the comment input after submission
  };

  return (
    <>
      {/* we set objectFit to "contain", which scales the image to maintain its aspect
      ratio while fitting within the element's content box. The entire image
      will be visible, but there may be unused space within the CardMedia
      component. */}
      <ol>
        {posts.map((post) => (
          <li key={post.key} style={{ marginTop: "10px" }}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar
                    src={post.val.profilePicture}
                    aria-label="profile-pic"
                  ></Avatar>
                }
                title={
                  <Typography
                    variant="body2"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {post.val.username}
                  </Typography>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              {/* Wrapped the <CardMedia> component with a <Link> component to create a clickable link to the post page.  */}
              {/* The to attribute of the <Link> specifies a unique URL for each post using the post's key. */}
              <Link to={`/post/${post.key}`}>
                <CardMedia
                  height="300px"
                  width="50px"
                  src={post.val.url}
                  component="img"
                  alt="Post Image"
                  style={{ objectFit: "contain" }}
                />
              </Link>
              <CardContent>
                <Typography
                  variant="body2"
                  style={{
                    marginRight: "8px",
                    fontWeight: "bold",
                    display: "inline",
                  }}
                >
                  {post.val.username}
                </Typography>
                <Typography variant="body2" style={{ display: "inline" }}>
                  {post.val.caption}
                </Typography>

                {/* onClick={() => handleLike(post.key)}: This part sets up an event
                handler for when the button is clicked. When the button is
                clicked, it calls the handleLike function with post.key as an
                argument. post.key uniquely identifies the post that is being
                liked or unliked. */}
                {/* {likedPosts.includes(post.key) ? ... : ...}: This is a conditional statement. 
                It checks if the post.key (the unique identifier of the post) is present in the likedPosts array. 
                If it is, that means the post is already liked. */}
                {/* <FavoriteIcon color="error" />: If the post is liked, it
                displays a heart icon (presumably representing a "favorite" or
                "like" action) in red. The color="error" part is likely used to
                change the icon color to red to indicate that it's liked. */}
                {/* <FavoriteIcon />: If the post is not liked, it displays the same
                heart icon in its default color. */}
                <div>
                  <IconButton onClick={() => handleLike(post.key)}>
                    {likedPosts.includes(post.key) ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteIcon />
                    )}
                    {post.val.likes}
                  </IconButton>
                </div>
              </CardContent>

              {/* Comment Input */}
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCommentSubmit(post.key)}
              >
                Comment
              </Button>

              {/* Comment Section */}
              <div>
                {post.val.comments && (
                  <ul>
                    {Object.keys(post.val.comments).map((commentKey) => (
                      <li key={commentKey}>
                        <Avatar
                          src={post.val.comments[commentKey].profilePicture}
                          aria-label="comment-profile-pic"
                        />
                        <Typography variant="body2">
                          <strong>
                            {post.val.comments[commentKey].username}
                          </strong>{" "}
                          {post.val.comments[commentKey].text}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </>
  );
}
