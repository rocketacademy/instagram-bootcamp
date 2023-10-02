import React from "react";

import { onChildAdded, ref } from "firebase/database";
import { realTimeDatabase } from "../firebase";
import { useState, useEffect } from "react";
import CommentList from "./CommentList";

const REALTIME_DATABASE_KEY = "posts";

export default function MessageList() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});

  //useEffect for posts
  useEffect(() => {
    const postListRef = ref(realTimeDatabase, REALTIME_DATABASE_KEY);
    onChildAdded(postListRef, (data) => {
      setPosts((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, []);

  return (
    <div>
      <ol>
        {posts && posts.length > 0 ? (
          posts.map((postItem) => (
            <li key={postItem.key}>
              <div>
                {postItem.val.user}
                {postItem.val.url ? (
                  <img src={postItem.val.url} alt={postItem.val.name} />
                ) : (
                  <p>No images</p>
                )}
                <h3>{postItem.val.description}</h3>
                <p>{postItem.val.date}</p>
                <p>{postItem.val.year}</p>
              </div>
              <CommentList postId={postItem.key} setUser={setUser} />
            </li>
          ))
        ) : (
          <p>No Posts Yet</p>
        )}
      </ol>
    </div>
  );
}
