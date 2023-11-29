import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Button, Dialog, DialogTitle, List, ListItem } from "@mui/material";
import React from "react";

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    const display =
      "comments" in this.props.post.val
        ? Object.values(this.props.post.val.comments).map((comment) => {
            return <ListItem>{comment}</ListItem>;
          })
        : "";

    return (
      <div>
        <Button onClick={() => this.setState({ open: true })}>
          <ChatBubbleOutlineIcon />
        </Button>
        <Dialog
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
        >
          <DialogTitle>Comment:</DialogTitle>
          <List>{display}</List>
        </Dialog>
      </div>
    );
  }
}
