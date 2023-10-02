import React from "react";
import { useState } from "react";
import { push, ref, set } from "firebase/database";
import { auth, realTimeDatabase } from "../firebase";

const REALTIME_DATABASE_KEY = "comments/";

export default function CommentForm({ postId }) {
  const [comment, setComment] = useState("");

  const writeData = () => {
    const commentListRef = ref(
      realTimeDatabase,
      REALTIME_DATABASE_KEY + postId
    );
    const newCommentRef = push(commentListRef);

    set(newCommentRef, {
      postId: postId,
      user: auth.currentUser.displayName,
      comment: comment,
      date: new Date().toLocaleTimeString(),
    });

    setComment("");
  };

  return (
    <div>
      <label>Comment</label>
      <br />
      <input
        type="text"
        name="comment"
        value={comment}
        placeholder="Insert Comments Here"
        onChange={(e) => setComment(e.target.value)}
      />
      <br />
      <button onClick={writeData}>Submit</button>
    </div>
  );
}
