import { push, ref as databaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import React, { useState } from "react";
import { database, storage } from "../firebase";

// Save Firebase folder names as constants to avoid bugs due to misspelling
const IMAGES_FOLDER_NAME = "images";
const POSTS_FOLDER_NAME = "posts";

const Composer = ({ loggedInUser }) => {
  const [fileInputFile, setFileInputFile] = useState();
  const [fileInputValue, setFileInputValue] = useState("");
  const [textInputValue, setTextInputValue] = useState("");

  const handleFileInputChange = (event) => {
    setFileInputFile(event.target.files[0]);
    setFileInputValue(event.target.value);
  };

  const handleTextInputChange = (event) => {
    setTextInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    // Prevent default form submit behaviour that will reload the page
    event.preventDefault();

    // Store images in an images folder in Firebase Storage
    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`
    );

    // Upload file, save file download URL in database with post text
    uploadBytes(fileRef, fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadUrl,
          text: textInputValue,
          authorEmail: loggedInUser.email,
        });
        // Reset input field after submit

        setFileInputFile(null);
        setFileInputValue("");
        setTextInputValue("");
      });
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>{loggedInUser ? loggedInUser.email : null}</p>
      <input
        type="file"
        value={fileInputValue}
        onChange={handleFileInputChange}
      />
      <br />
      <input
        type="text"
        value={textInputValue}
        onChange={handleTextInputChange}
      />
      <input
        type="submit"
        value="Post"
        // Disable Send button when text input is empty
        disabled={!textInputValue}
      />
    </form>
  );
};

export default Composer;
