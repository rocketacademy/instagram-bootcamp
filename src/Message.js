import { Table, TableRow, TableCell } from "@mui/material";

export default function Message(props) {
  console.log(props.messages);
  const display = props.messages.map((message) => {
    return (
      <TableRow key={message.key}>
        <TableCell>{message.val.date}</TableCell>
        <TableCell>{message.val.message}</TableCell>
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
