import React from "react";
import {
  Typography,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { database } from "../firebase";
import { onChildAdded, ref as databaseRef, remove } from "firebase/database";

const MESSAGE_FOLDER_NAME = "messages";

export default function PostDisplay() {
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    const messagesRef = databaseRef(database, MESSAGE_FOLDER_NAME);

    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render

      // Store message key so we can use it as a key in our list items when rendering messages
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          key: data.key,
          message: data.val().message,
          date: data.val().date,
          imageURL: data.val().imageURL,
        },
      ]);
    });
  }, []);

  const handleDelete = (id) => {
    remove(databaseRef(database, `${MESSAGE_FOLDER_NAME}/${id}`));
    setMessages((prev) => prev.filter((message) => message.key !== id));
  };

  return (
    <Box sx={{ bgcolor: "white", height: "50%" }}>
      {messages.map((message) => (
        <Card key={message.key} sx={{ maxWidth: "50ch", ml: 1 }}>
          <CardActionArea>
            <CardMedia component="img" height="140" image={message?.imageURL} />
            <CardContent>
              <Typography gutterBottom variant="body2" component="div">
                {message.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(message.date).toLocaleString()}
              </Typography>
            </CardContent>
            <DeleteIcon onClick={() => handleDelete(message.key)} />
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
