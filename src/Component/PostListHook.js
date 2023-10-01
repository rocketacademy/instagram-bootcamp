import React from "react";

import { onChildAdded, ref } from "firebase/database";
import { realTimeDatabase } from "../firebase";
import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";

const REALTIME_DATABASE_KEY = "posts";
const REALTIME_DATABASE_KEY_COMMENTS = "comments/";

export default function MessageList() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);

  //useEffect for posts
  useEffect(() => {
    const postListRef = ref(realTimeDatabase, REALTIME_DATABASE_KEY);
    onChildAdded(postListRef, (data) => {
      setPosts((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, []);

  //useEffect for comments in post
  useEffect(() => {
    const commentListRef = ref(
      realTimeDatabase,
      REALTIME_DATABASE_KEY_COMMENTS
    );

    onChildAdded(commentListRef, (data) => {
      setComments((state) => [...state, { key: data.key, val: data.val() }]);
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
              </div>
              <div>
                <ol>
                  {comments && comments.length > 0
                    ? comments.map((commentsItem) => (
                        <li key={commentsItem.key}>
                          <div>
                            <h2>{commentsItem.val.comment}</h2>
                            <p>{commentsItem.val.date}</p>
                          </div>
                        </li>
                      ))
                    : null}
                </ol>
              </div>
              <CommentForm setUser={setUser} setPosts={setPosts} />
            </li>
          ))
        ) : (
          <p>No Posts Yet</p>
        )}
      </ol>
    </div>
  );
}
