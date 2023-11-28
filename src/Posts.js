import { Table, TableRow, TableCell, Button } from "@mui/material";

export default function Posts(props) {
  const display = props.posts.map((post) => {
    return (
      <TableRow key={post.key}>
        <TableCell>{post.val.postNo + 1}</TableCell>
        <TableCell>{post.val.date}</TableCell>
        <TableCell>
          <Button variant="text" onClick={() => props.handleLike(post)}>
            ♡
          </Button>
          {post.val.likes}
        </TableCell>
        <TableCell>{post.val.message}</TableCell>
        <TableCell>
          {post.val.url !== undefined && (
            <img src={post.val.url} alt={post.val.postNo} />
          )}
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Table>
      <TableRow className="sticky">
        <TableCell>Post:</TableCell>
        <TableCell>Time:</TableCell>
        <TableCell>Likes:</TableCell>
        <TableCell>Message:</TableCell>
        <TableCell>Picture:</TableCell>
      </TableRow>
      {display}
    </Table>
  );
}
