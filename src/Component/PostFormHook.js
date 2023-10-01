import React from "react";
import { push, ref, set } from "firebase/database";
import { realTimeDatabase, storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useState } from "react";

const REALTIME_DATABASE_KEY = "posts";
const STORAGE_KEY = "posts/";

export default function PostForm() {
  const [description, setDescription] = useState("");
  const [fileInputFile, setFileInputFile] = useState("");
  const [fileInputValue, setFileInputValue] = useState("");

  const writeData = (url) => {
    const postListRef = ref(realTimeDatabase, REALTIME_DATABASE_KEY);
    const newPostRef = push(postListRef);

    set(newPostRef, {
      description: description,
      date: new Date().toLocaleTimeString(),
      url: url,
    });

    setDescription("");
    setFileInputFile(null);
    setFileInputValue("");
  };

  const submit = () => {
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + fileInputFile.name
    );

    uploadBytes(fullStorageRef, fileInputFile).then(() => {
      getDownloadURL(fullStorageRef, fileInputFile.name).then((url) => {
        writeData(url);
      });
    });
  };

  return (
    <div className="posts">
      <h1>Posts</h1>
      <input
        type="file"
        name="file"
        value={fileInputValue}
        onChange={(e) => {
          setFileInputFile(e.target.files[0]);
          setFileInputValue(e.target.file);
        }}
      />
      <br />
      <label>Description</label>
      <br />
      <input
        type="text"
        name="description"
        value={description}
        placeholder="Insert Description Here"
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <button onClick={submit}>Submit</button>
    </div>
  );
}
