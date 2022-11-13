import * as React from "react";
import { Button, Stack, TextField, Box } from "@mui/material";
import { Send } from "@mui/icons-material";

import { database, storage } from "../firebase";

import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import {
  push,
  ref as databaseRef,
  set,
  serverTimestamp,
} from "firebase/database";

const MESSAGE_FOLDER_NAME = "messages";
const IMAGES_FOLDER_NAME = "images";

export default function InputForm(props) {
  const [inputText, setInputText] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [fileValue, setFileValue] = React.useState("");

  const handleFileChange = (e) => {
    setFileValue(e.target.value);
    setImage(e.target.files[0]);
  };

  const handleWrite = (event) => {
    event.preventDefault();

    const fileRef = storageRef(storage, `${IMAGES_FOLDER_NAME}/${image.name}`);

    //for image
    uploadBytes(fileRef, image).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const messageListRef = databaseRef(database, MESSAGE_FOLDER_NAME);
        const newMessageRef = push(messageListRef);

        set(newMessageRef, {
          message: inputText,
          imageURL: downloadUrl,
          date: serverTimestamp(),
        });
      });
    });
    setInputText("");
    setImage(null);
    setFileValue("");
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "50%" },
          display: "flex",
          flexDirection: "row",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-multiline-static"
          label="message"
          multiline
          type="text"
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
        />

        <TextField
          id="outlined-basic"
          type="file"
          value={fileValue}
          onChange={handleFileChange}
          variant="outlined"
        />
      </Box>
      <Stack>
        <Button onClick={handleWrite} variant="contained">
          <Send />
        </Button>
      </Stack>
    </>
  );
}
