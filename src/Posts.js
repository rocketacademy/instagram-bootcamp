import { Table, TableRow, TableCell } from "@mui/material";

export default function Posts(props) {
  const display = props.posts.map((post) => {
    return (
      <TableRow key={post.key}>
        <TableCell>{post.val.date}</TableCell>
        <TableCell>{post.val.message}</TableCell>
        <TableCell>
          <img src={post.val.url} alt={post.val.postNo} />
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Table>
      <TableRow>
        <TableCell>Time:</TableCell>
        <TableCell>Message:</TableCell>
      </TableRow>
      {display}
    </Table>
  );
}
