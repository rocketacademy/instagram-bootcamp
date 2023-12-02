import { Table, TableRow, TableCell, ToggleButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import React from "react";
import Comment from "./Comment";

export default class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = { button: {} };
  }

  handleChange = (post) => {
    const updated = {};
    let isLike = true;
    if (post.val.postNo in this.state.button) {
      isLike = !this.state.button[post.val.postNo];
    }
    updated[post.val.postNo] = isLike;
    this.props.handleLike(post, isLike);
    this.setState({ button: { ...this.state.button, ...updated } });
  };
  render() {
    const display = this.props.posts.map((post) => {
      return (
        <TableRow key={post.key}>
          <TableCell>{post.val.author}</TableCell>
          <TableCell>{post.val.date}</TableCell>
          <TableCell>
            {post.val.url !== undefined && (
              <img src={post.val.url} alt={post.val.postNo} />
            )}
          </TableCell>
          <TableCell>
            {post.val.message}
            <Comment post={post} />
          </TableCell>
          <TableCell>
            <ToggleButton
              value="like"
              selected={this.state.button[post.val.postNo]}
              onChange={() => this.handleChange(post)}
            >
              {this.state.button[post.val.postNo] ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </ToggleButton>
            {post.val.likes}
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Table>
        <TableRow className="sticky">
          <TableCell>Author</TableCell>
          <TableCell>Time:</TableCell>
          <TableCell>Picture:</TableCell>

          <TableCell>Message:</TableCell>
          <TableCell>Likes:</TableCell>
        </TableRow>
        {display}
      </Table>
    );
  }
}
