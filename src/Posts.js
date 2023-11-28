import { Table, TableRow, TableCell } from "@mui/material";

export default function Posts(props) {
  const display = props.posts.map((post) => {
    return (
      <TableRow key={post.key}>
        <TableCell>{post.val.postNo + 1}</TableCell>
        <TableCell>{post.val.date}</TableCell>
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
      <TableRow>
        <TableCell>Post:</TableCell>
        <TableCell>Time:</TableCell>
        <TableCell>Message:</TableCell>
        <TableCell>Picture:</TableCell>
      </TableRow>
      {display}
    </Table>
  );
}
