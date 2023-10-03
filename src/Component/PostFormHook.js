import React from "react";
import { push, ref, set } from "firebase/database";
import { auth, realTimeDatabase, storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useState } from "react";
import "./PostFormHook.css";

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
      user: auth.currentUser.displayName,
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
    <div className="post-container">
      <h1 className="post-header">UPLOAD POST</h1>
      <div className="file-post-container">
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
        <input
          type="text"
          name="description"
          value={description}
          placeholder="Insert Description Here"
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button className="post-form-button" onClick={submit}>
          Submit
        </button>
      </div>
    </div>
  );
}
