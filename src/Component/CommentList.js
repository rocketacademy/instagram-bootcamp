import React from "react";

import { onChildAdded, ref } from "firebase/database";
import { realTimeDatabase } from "../firebase";
import { useState, useEffect } from "react";

const REALTIME_DATABASE_KEY = "comments";

export default function CommentList() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const commentListRef = ref(realTimeDatabase, REALTIME_DATABASE_KEY);

    // const commentsRef = ref(db, "post-comments/" + postId);
    // onChildAdded(commentsRef, (data) => {
    //   addCommentElement(postElement, data.key, data.val().text, data.val().author);
    // });

    onChildAdded(commentListRef, (data) => {
      setComments((state) => [
        ...state,
        { key: data.key, val: data.val().author },
      ]);
    });
  }, []);

  return (
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
  );
}
