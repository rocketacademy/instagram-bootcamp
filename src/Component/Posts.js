import { Table, TableRow, TableCell, ToggleButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import React from "react";
import Comment from "./Comment";
import { ref, update } from "firebase/database";
import { database } from "../firebase";

export default class Posts extends React.Component {
  handleLike = (post, liked) => {
    const postRef = ref(database, "posts/" + post.key);
    if (liked) {
      const index = post.val.likes.indexOf(this.props.user.uid);
      const replace = post.val.likes.toSpliced(index, 1);
      update(postRef, { likes: replace });
    } else if ("likes" in post.val) {
      update(postRef, { likes: [...post.val.likes, this.props.user.uid] });
    } else {
      update(postRef, { likes: [this.props.user.uid] });
    }
  };

  likeButton = (post, liked) => {
    return (
      this.props.user && (
        <ToggleButton
          value="like"
          selected={liked}
          onChange={() => this.handleLike(post, liked)}
        >
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </ToggleButton>
      )
    );
  };

  render() {
    const display = this.props.posts.map((post) => {
      const liked =
        "likes" in post.val &&
        this.props.user &&
        post.val.likes.includes(this.props.user.uid);
      return (
        <TableRow key={post.key}>
          <TableCell>{post.val.author}</TableCell>
          <TableCell>{post.val.date}</TableCell>
          <TableCell>
            {post.val.url !== undefined && (
              <img src={post.val.url} alt={post.key} />
            )}
          </TableCell>
          <TableCell>
            {post.val.message}
            <Comment
              post={post}
              user={this.props.user ? this.props.user : null}
              likeButton={this.likeButton}
              liked={liked}
            />
          </TableCell>
          <TableCell>
            {this.likeButton(post, liked)}
            {"likes" in post.val ? post.val.likes.length : 0}
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Table className="post">
        <TableRow className="post-info">
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
