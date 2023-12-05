import { Button, List, ListItemText, TextField } from "@mui/material";
import { push, ref, set } from "firebase/database";
import { useState } from "react";
import { database } from "../firebase";

export default function Comment(props) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input === "") {
      return;
    }
    const DB_COMMENTS_KEY = `posts/${props.post.key}/comments`;
    const commentRef = ref(database, DB_COMMENTS_KEY);
    const newCommentRef = push(commentRef);
    set(newCommentRef, {
      author: props.user.displayName
        ? props.user.displayName
        : props.user.email,
      comment: input,
    });
    setInput("");
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const display =
    "comments" in props.post.val
      ? Object.values(props.post.val.comments).map(({ author, comment }, i) => {
          return (
            <ListItemText key={Object.keys(props.post.val.comments)[i]}>
              {author}: {comment}
            </ListItemText>
          );
        })
      : "No comments";

  return (
    <div className="comment">
      <div className="comment-img">
        {props.post.val.url !== undefined && (
          <img src={props.post.val.url} alt={props.post.val.postNo} />
        )}
      </div>
      {props.post.val.author}:<h4>{props.post.val.message}</h4>
      Comment:
      <List className="comment-list">{display}</List>
      {props.user && (
        <div className="comment-input">
          <TextField
            value={input}
            onChange={handleChange}
            label="Leave your comment"
          />
          <Button onClick={handleSubmit} variant="contained">
            Send
          </Button>
        </div>
      )}
    </div>
  );
}
