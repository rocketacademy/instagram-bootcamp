import React from "react";
import { push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";
// import to use methods to access and upload from firebase/storage
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useState } from "react";
import Grid from "@mui/material/Grid";

// Save the Firebase post folder name as a constant to avoid bugs due to misspelling
const DB_POST_FOLDER_NAME = "posts";
const IMAGE_FOLDER_NAME = "images";

export default function Composer({ username, isLoggedIn }) {
  const [currPost, setCurrPost] = useState("");
  const [fileInputFile, setFileInputFile] = useState("");
  const [fileInputValue, setFileInputValue] = useState("");
  console.log();
  const writeData = (url) => {
    const postRef = ref(database, DB_POST_FOLDER_NAME);
    const newPostRef = push(postRef);
    set(newPostRef, {
      posts: currPost,
      date: new Date().toLocaleDateString(),
      url: url,
      author: username,
      likeCounts: 0,
      likeBy: "",
    });

    setCurrPost("");
    setFileInputFile("");
    setFileInputValue("");
  };

  const handleSubmit = (e) => {
    // Prevent default form submit behaviour that will reload the page
    e.preventDefault();

    // Store images in an images folder in Firebase Storage
    const fileRef = storageRef(
      storage,
      ` ${IMAGE_FOLDER_NAME}/${fileInputFile.name}`
    );
    console.log(` ${IMAGE_FOLDER_NAME}/${fileInputFile.name}`);

    uploadBytes(fileRef, fileInputFile).then((snapshot) => {
      getDownloadURL(fileRef).then((url) => {
        writeData(url);
      });
    });
  };

  return (
    <Grid>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="currPost"
            value={currPost}
            placeholder="Input your post"
            onChange={(e) => setCurrPost(e.target.value)}
          />
          <br />
          <input
            type="file"
            name="file"
            value={fileInputValue}
            onChange={(e) => {
              setFileInputFile(e.target.files[0]);
              setFileInputValue(e.target.value);
            }}
          />
          <input type="submit" name="submit" />
        </form>
      ) : (
        <>
          <h3>Click on the navigation bar to login to post!</h3>
        </>
      )}
    </Grid>
  );
}
