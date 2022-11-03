import React, { useState, useEffect } from "react";
import { onChildAdded, push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "./firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import logo from "./logo.png";
import "./App.css";
import Card from "react-bootstrap/Card";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const POSTS_FOLDER_NAME = "posts";
const IMAGES_FOLDER_NAME = "images";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");
  const [fileInput, setFileInput] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);

  const postRef = databaseRef(database, POSTS_FOLDER_NAME);

  useEffect(() => {
    // onChildAdded will return data for every child at the reference and every subsequent new child
    const post = [];
    onChildAdded(postRef, (data) => {
      post.push({ key: data.key, val: data.val() });
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setPosts([...post]);
    });
  }, []);
  // Note use of array fields syntax to avoid having to manually bind this method to the class

  const postListItems = posts.map((post) => (
    <Card style={{ width: "18rem" }} key={post.key} className="post">
      <Card.Img variant="top" src={post.val.imageLink} className="image" />
      <Card.Body>
        <Card.Text>
          Post Date: {new Date().toLocaleString("en-GB", { timeZone: "Japan" })}
        </Card.Text>
        <Card.Text>{post.val.text}</Card.Text>
      </Card.Body>
    </Card>
  ));

  const handlePostChange = (e) => {
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
        });
      });
    });
    setInput("");
    setFileInput("");
    setFileInputFile(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br></br>
        <form onSubmit={handleSubmit}>
          <input type="file" value={fileInput} onChange={handleFileChange} />
          <input
            type="text"
            id="message"
            required
            onChange={handlePostChange}
          />
          <input type="submit" value="Send" disabled={!input} />
        </form>
        <ol>{postListItems}</ol>
      </header>
    </div>
  );
};

export default App;
