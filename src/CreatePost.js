import React, { useState } from "react";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "./firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";

const CreatePost = ({ currentUser }) => {
  const [userInput, setUserInput] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  const onFileChange = (event) => {
    setFileInputValue(event.target.value);
    setFileInputFile(event.target.files[0]);
  };

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const writeData = (event) => {
    event.preventDefault();
    const imageReference = storageRef(storage, `images/${fileInputFile.name}`);

    uploadBytes(imageReference, fileInputFile)
      .then(() => getDownloadURL(imageReference))
      .then((url) => {
        const messageListRef = databaseRef(database, MESSAGE_FOLDER_NAME);
        const newMessageRef = push(messageListRef);

        set(newMessageRef, {
          userMessage: userInput,
          imageURL: url,
          date: Date(),
          user: currentUser,
        });
        setUserInput("");
        setFileInputValue("");
      })
      .catch((error) => console.log(error));
  };

  return (
    <form>
      <label>Upload a Photo: </label>
      <input
        id="post-picture"
        name="post-picture"
        type="file"
        accept="image/png, image/jpeg"
        onChange={onFileChange}
        value={fileInputValue}
      />
      <input onChange={handleUserInput} name="userInput" value={userInput} />
      <button type="submit" onClick={writeData}>
        Send
      </button>
    </form>
  );
};

export default CreatePost;
