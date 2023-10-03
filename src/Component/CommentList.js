import React from "react";

import { onChildAdded, ref } from "firebase/database";
import { realTimeDatabase } from "../firebase";
import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import "./CommentList.css";

const REALTIME_DATABASE_KEY = "comments/";

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const commentListRef = ref(
      realTimeDatabase,
      REALTIME_DATABASE_KEY + postId
    );

    onChildAdded(commentListRef, (data) => {
      setComments((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, [postId]);

  return (
    <div className="all-comments">
      {comments.map((commentItem) => (
        <div className="comment-main-container" key={commentItem.key}>
          <div className="comment-container">
            <h4 className="comments">{commentItem.val.comment}</h4>
            <p className="creator-time">
              commented by {commentItem.val.user} -{commentItem.val.date}
            </p>
          </div>
        </div>
      ))}
      <CommentForm postId={postId} />
    </div>
  );
}
