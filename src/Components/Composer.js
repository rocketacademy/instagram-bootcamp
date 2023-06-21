import { useState } from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Save the Firebase post folder name as a constant to avoid bugs due to misspelling
const POST_KEY = "posts";
const STORAGE_KEY = "images/";

function Composer({ email }) {
  const [textInput, setTextInput] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  const writeData = (url, fileStorageRef) => {
    const postRef = databaseRef(database, POST_KEY);
    const newPostRef = push(postRef);
    set(newPostRef, {
      textInput: textInput,
      date: new Date().toLocaleString(),
      url: url,
      email: email,
      likeCount: 0,
      imageRef: String(fileStorageRef),
    });

    setTextInput("");
    setFileInputFile(null);
    setFileInputValue("");
  };

  const submit = (e) => {
    e.preventDefault();

    const fileStorageRef = storageRef(
      storage,
      STORAGE_KEY + fileInputFile.name
    );

    uploadBytes(fileStorageRef, fileInputFile)
      .then(() => getDownloadURL(fileStorageRef))
      .then((url) => writeData(url, fileStorageRef));
  };

  return (
    <div>
      <form onSubmit={submit}>
        <label>Submit your thoughts below: </label>
        <br />
        <input
          type="text"
          name="textInput"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
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
        <br />
        <button>Send</button>
      </form>
    </div>
  );
}

export default Composer;
