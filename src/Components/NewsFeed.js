import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { realTimeDatabase } from "../firebase";

const POSTS_FOLDER_NAME = "posts";

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsRef = databaseRef(realTimeDatabase, POSTS_FOLDER_NAME);
    const handleChildAdded = (data) => {
      setPosts((prevPosts) => [
        ...prevPosts,
        { key: data.key, val: data.val() },
      ]);
    };
    onChildAdded(postsRef, handleChildAdded);

    // Clean up the event listener when the component unmounts
    return () => {
      onChildAdded(postsRef, handleChildAdded);
    };
  }, []);

  let postCards = posts.map((post) => (
    <Card bg="dark" key={post.key}>
      <Card.Img src={post.val.imageLink} className="Card-Img" />
      <Card.Text>{post.val.text}</Card.Text>
    </Card>
  ));

  postCards = postCards.reverse();

  return postCards;
};

export default NewsFeed;

// import React from "react";
// import Card from "react-bootstrap/Card";
// import { onChildAdded, ref as databaseRef } from "firebase/database";
// import { database } from "../firebase";

// // Save the Firebase message folder name as a constant to avoid bugs due to misspelling
// const POSTS_FOLDER_NAME = "posts";

// class NewsFeed extends React.Component {
//   constructor(props) {
//     super(props);
//     // Initialise empty messages array in state to keep local state in sync with Firebase
//     // When Firebase changes, update local state, which will update local UI
//     this.state = {
//       posts: [],
//     };
//   }

//   componentDidMount() {
//     const postsRef = databaseRef(database, POSTS_FOLDER_NAME);
//     // onChildAdded will return data for every child at the reference and every subsequent new child
//     onChildAdded(postsRef, (data) => {
//       // Add the subsequent child to local component state, initialising a new array to trigger re-render
//       this.setState((state) => ({
//         // Store post key so we can use it as a key in our list items when rendering posts
//         posts: [...state.posts, { key: data.key, val: data.val() }],
//       }));
//     });
//   }

//   render() {
//     // Convert posts in state to post JSX elements to render
//     let postCards = this.state.posts.map((post) => (
//       <Card bg="dark" key={post.key}>
//         <Card.Img src={post.val.imageLink} className="Card-Img" />
//         <Card.Text>{post.val.text}</Card.Text>
//       </Card>
//     ));
//     // Reverse the order of posts such that newest posts are on top
//     postCards.reverse();
//     return postCards;
//   }
// }

// export default NewsFeed;
