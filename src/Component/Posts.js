import { Table, TableRow, TableCell, ToggleButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Comment from "./Comment";
import { ref, update } from "firebase/database";
import { database } from "../firebase";

export default function Posts(props) {
  const handleLike = (post, liked) => {
    const postRef = ref(database, "posts/" + post.key);
    if (liked) {
      const index = post.val.likes.indexOf(props.user.uid);
      const replace = post.val.likes.toSpliced(index, 1);
      update(postRef, { likes: replace });
    } else if ("likes" in post.val) {
      update(postRef, { likes: [...post.val.likes, props.user.uid] });
    } else {
      update(postRef, { likes: [props.user.uid] });
    }
  };

  const likeButton = (post, liked) => {
    return (
      props.user && (
        <ToggleButton
          value="like"
          selected={liked}
          onChange={() => handleLike(post, liked)}
          style={{ height: "30px", width: "30px" }}
        >
          {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </ToggleButton>
      )
    );
  };

  const display = props.posts.map((post) => {
    const liked =
      "likes" in post.val &&
      props.user &&
      post.val.likes.includes(props.user.uid);
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
            user={props.user ? props.user : null}
            likeButton={likeButton}
            liked={liked}
          />
        </TableCell>
        <TableCell>
          {likeButton(post, liked)}
          {"likes" in post.val ? post.val.likes.length : 0}
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Table className="post">
      <TableRow style={{ backgroundColor: "secondary" }}>
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
