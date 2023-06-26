import { useState } from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Save the Firebase post folder name as a constant to avoid bugs due to misspelling
const POST_KEY = "posts";
const STORAGE_KEY = "images/";

function Composer({ email, loggedInUser }) {
  const [textInput, setTextInput] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  const writeData = (url, fileStorageRef) => {
    const postRef = databaseRef(database, POST_KEY);
    const newPostRef = push(postRef);
    // Initialize likes object with the key being a computed property name. Depending on who the loggedInUser is, the likes object key will be that user's uid.
    const likes = {
      [loggedInUser]: false,
    };
    set(newPostRef, {
      textInput: textInput,
      date: new Date().toLocaleString(),
      url: url,
      email: email,
      likes: likes,
      imageRef: String(fileStorageRef),
    });

    setTextInput("");
    setFileInputFile(null);
    setFileInputValue("");
  };

  const submit = (e) => {
    e.preventDefault();

    // Use uuid npm package to generate a unique string + the local file name so even if a same pic with the same file name is uploaded twice, the newer pic will not overwrite the older one and both pic can be stored and rendered independently
    const uniqueFileName = `${fileInputFile.name}.${uuidv4()}`;
    const fileStorageRef = storageRef(storage, STORAGE_KEY + uniqueFileName);

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
