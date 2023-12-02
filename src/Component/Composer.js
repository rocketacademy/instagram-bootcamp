import React, { useState } from "react";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";

const DB_POSTS_KEY = "posts";

export default function Composer(props) {
  const [input, setInput] = useState("");
  const [inputFile, setInputFile] = useState(null);
  const [inputFileValue, setInputFileValue] = useState("");

  const handleSumbit = () => {
    if (inputFile === null) {
      writeData(null);
      return;
    }
    const imgRef = storageRef(storage, inputFile.name + props.posts.length);
    uploadBytes(imgRef, inputFile).then(() => {
      getDownloadURL(imgRef).then((url) => writeData(url));
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  const writeData = (url) => {
    const postsListRef = ref(database, DB_POSTS_KEY);
    const newPostRef = push(postsListRef);
    set(newPostRef, {
      postNo: props.posts.length,
      message: input,
      date: new Date().toLocaleString(),
      url: url,
      likes: 0,
    });
    setInput("");
    setInputFile(null);
    setInputFileValue("");
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        placeholder="Please type in message"
      />
      <input
        type="file"
        accept="image/*"
        value={inputFileValue}
        onChange={(e) => {
          setInputFile(e.target.files[0]);
          setInputFileValue(e.target.value);
        }}
      />
      <button onClick={() => handleSumbit()}>Send</button>
    </div>
  );
}
