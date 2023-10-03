import React from "react";

import { onChildAdded, ref } from "firebase/database";
import { realTimeDatabase } from "../firebase";
import { useState, useEffect } from "react";
import CommentList from "./CommentList";
import "./PostListHook.css";

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
    <div className="all-posts">
      {posts && posts.length > 0 ? (
        posts.map((postItem) => (
          <div key={postItem.key} className="post-it-main-container">
            <div className="post-it-container">
              {postItem.val.url ? (
                <img src={postItem.val.url} alt={postItem.val.name} />
              ) : (
                <p>No images</p>
              )}
              <div className="post-content">
                <p>
                  Created by {postItem.val.user}
                  <br />
                  {postItem.val.date}
                </p>
                <p>{postItem.val.description}</p>
              </div>
            </div>
            <CommentList postId={postItem.key} setUser={setUser} />
          </div>
        ))
      ) : (
        <p>No Posts Yet</p>
      )}
    </div>
  );
}
