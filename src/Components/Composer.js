import React, { useState } from "react";
import { database, storage } from "../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { push, ref as databaseRef, set } from "firebase/database";

const POSTS_FOLDER_NAME = "posts";
const IMAGES_FOLDER_NAME = "images";

export default function Composer({ loggedInUser }) {
  const [fileInputFile, setFileInputFile] = useState(null);
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
    event.preventDefault();

    const fileRef = storageRef(
      storage,
      `${IMAGES_FOLDER_NAME}/${fileInputFile.name}`
    );

    uploadBytes(fileRef, fileInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const postListRef = databaseRef(database, POSTS_FOLDER_NAME);
        const newPostRef = push(postListRef);
        set(newPostRef, {
          imageLink: downloadUrl,
          text: textInputValue,
          authorEmail: loggedInUser.email,
        });

        setFileInputFile(null);
        setFileInputValue("");
        setTextInputValue("");
      });
    });
  };

  return (
    <div className="composer-container">
      <form onSubmit={handleSubmit}>
        <label id="Composer-Header"> Post a picture: </label>
        <br />
        <p id="Composer-Text">
          {loggedInUser ? `User:  ${loggedInUser.email}` : null}
        </p>
        <input
          type="file"
          value={fileInputValue}
          onChange={handleFileInputChange}
          id="Composer-InputFile"
        />
        <br />
        <input
          type="text"
          value={textInputValue}
          onChange={handleTextInputChange}
        />
        &nbsp;
        <input
          type="submit"
          value="Post"
          //Disable Send button when text input is empty
          disabled={!textInputValue}
        />
      </form>
    </div>
  );
}
