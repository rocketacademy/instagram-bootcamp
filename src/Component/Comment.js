import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  Button,
  Dialog,
  DialogTitle,
  Divider,
  List,
  ListItemText,
  TextField,
} from "@mui/material";
import { push, ref, set } from "firebase/database";
import { useState } from "react";
import { database } from "../firebase";

export default function Comment(props) {
  const [open, setOpen] = useState(false);
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
    <div>
      <Button onClick={() => setOpen(true)}>
        <ChatBubbleOutlineIcon />
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <div className="dialog">
          <div className="comment-img">
            {props.post.val.url !== undefined && (
              <img src={props.post.val.url} alt={props.post.val.postNo} />
            )}
          </div>
          {props.post.val.author}:
          <DialogTitle>{props.post.val.message}</DialogTitle>
          <div className="comment-like">
            Likes: {props.likeButton(props.post, props.liked)}
            {"likes" in props.post.val ? props.post.val.likes.length : 0}
          </div>
          <Divider />
          Comment:
          <List>{display}</List>
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
      </Dialog>
    </div>
  );
}
