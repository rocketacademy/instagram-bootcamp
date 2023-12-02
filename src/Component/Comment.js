import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  TextField,
} from "@mui/material";
import { push, ref, set } from "firebase/database";
import React from "react";
import { database } from "../firebase";

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, input: "" };
  }

  handleSubmit = () => {
    if (this.state.input === "") {
      return;
    }
    const DB_COMMENTS_KEY = `posts/${this.props.post.key}/comments`;
    const commentRef = ref(database, DB_COMMENTS_KEY);
    const newCommentRef = push(commentRef);
    set(newCommentRef, this.state.input);
    this.setState({ input: "" });
  };

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  };

  render() {
    const display =
      "comments" in this.props.post.val
        ? Object.values(this.props.post.val.comments).map((comment, i) => {
            return (
              <ListItem key={Object.keys(this.props.post.val.comments)[i]}>
                {comment}
              </ListItem>
            );
          })
        : "No comments";

    return (
      <div>
        <Button onClick={() => this.setState({ open: true })}>
          <ChatBubbleOutlineIcon />
        </Button>
        <Dialog
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
          fullWidth
        >
          <div className="dialog">
            <div className="comment-img">
              {this.props.post.val.url !== undefined && (
                <img
                  src={this.props.post.val.url}
                  alt={this.props.post.val.postNo}
                />
              )}
            </div>
            {this.props.post.val.author}:
            <DialogTitle>{this.props.post.val.message}</DialogTitle>
            Comment:
            <List>{display}</List>
            {this.props.user ? (
              <div>
                <TextField
                  onChange={this.handleChange}
                  placeholder="Leave your comment"
                />
                <Button onClick={this.handleSubmit} variant="contained">
                  Send
                </Button>
              </div>
            ) : (
              <p>Please sign up or log-in to leave comments</p>
            )}
          </div>
        </Dialog>
      </div>
    );
  }
}
