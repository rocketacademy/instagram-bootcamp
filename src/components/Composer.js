import React, { useState, useEffect } from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

const Composer = (props) => {
  const [input, setInput] = useState("");
  const [fileInput, setFileInput] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);

  const POSTS_FOLDER_NAME = "posts";
  const IMAGES_FOLDER_NAME = "images";
  const LIKES_FOLDER_NAME = "likes";

  const handlePostMessageChange = (e) => {
    setInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFileInputFile(e.target.files[0]);
    setFileInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const imageRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`,
    );
    uploadBytes(imageRef, fileInputFile).then(() => {
      getDownloadURL(imageRef).then((downloadURL) => {
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadURL,
          text: input,
          authorEmail: props.loggedInUser.email,
        });
      });
    });
    setInput("");
    setFileInput("");
    setFileInputFile(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>{props.loggedInUser ? props.loggedInUser.email : null}</p>
        <input type="file" value={fileInput} onChange={handleFileChange} />
        <input type="text" id="message" required onChange={handlePostMessageChange} />
        <input type="submit" value="Send" disabled={!input} />
      </form>
    </div>
  );
};

export default Composer;
