import React from "react";
import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";
import { useState, useEffect } from "react";

// Save the Firebase post folder name as a constant to avoid bugs due to misspelling
const DB_POST_FOLDER_NAME = "posts";

export default function NewsFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postRef = ref(database, DB_POST_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postRef, (data) => {
      setPosts((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, []);
  // The empty array indicates that the useEffect doesn’t have any dependencies on any state variables. Therefore, the callback function is only called once the page renders in this case.

  // Convert posts in state to post JSX elements to render
  let postListItems = posts.map((post) => (
    <div key={post.key}>
      {post.val.url ? (
        <img src={post.val.url} alt={post.val.name} />
      ) : (
        <p>No image</p>
      )}{" "}
      <br />
      {post.val.posts} <br />
      {post.val.author}:{post.val.date} - {post.val.time} <br />
    </div>
  ));
  return <div>{postListItems}</div>;
}
