import { useState } from "react";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";
import { Button, Card, Input, TextField } from "@mui/material";

const DB_POSTS_KEY = "posts";

export default function Composer(props) {
  const [input, setInput] = useState("");
  const [inputFile, setInputFile] = useState(null);
  const [inputFileValue, setInputFileValue] = useState("");

  const handleSumbit = () => {
    if (inputFile === null && input === "") {
      return;
    }
    if (inputFile === null) {
      writeData(null);
      return;
    }
    const imgRef = storageRef(storage, inputFile.name + new Date());
    uploadBytes(imgRef, inputFile).then(() => {
      getDownloadURL(imgRef).then((url) => writeData(url));
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  const writeData = (url) => {
    const postsListRef = ref(database, DB_POSTS_KEY);
    const newPostRef = push(postsListRef);
    set(newPostRef, {
      author: props.author,
      message: input,
      date: new Date().toLocaleString(),
      url: url,
    });
    setInput("");
    setInputFile(null);
    setInputFileValue("");
  };

  return (
    <Card variant="outlined" className="composer">
      <Input
        type="file"
        accept="image/*"
        value={inputFileValue}
        onChange={(e) => {
          setInputFile(e.target.files[0]);
          setInputFileValue(e.target.value);
        }}
        style={{ width: "80%" }}
      />
      <TextField
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        label="Please type in message"
        style={{ margin: "5px" }}
      />
      <Button variant="contained" onClick={() => handleSumbit()}>
        Send
      </Button>
    </Card>
  );
}
