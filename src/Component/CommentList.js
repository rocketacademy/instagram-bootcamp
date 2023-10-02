import React from "react";

import { onChildAdded, ref } from "firebase/database";
import { realTimeDatabase } from "../firebase";
import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";

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
    <div>
      <ol>
        {comments.map((commentItem) => (
          <li key={commentItem.key}>
            <div>
              <h2>commented by {commentItem.val.user}</h2>
              <h2>{commentItem.val.comment}</h2>
              <p>{commentItem.val.date}</p>
            </div>
          </li>
        ))}
      </ol>
      <CommentForm postId={postId} />
    </div>
  );
}
