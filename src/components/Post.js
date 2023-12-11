import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useInput from "./hooks/useInput";
import { database, storage, auth } from "../firebase";
import { ref, push, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const STORAGE_KEY = "images/";
const DB_POSTS_KEY = "posts";

const Post = () => {
  const [caption, setNewCaption, resetCaption] = useInput("");
  const [file, setFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file && !caption) return;

    if (!file) {
      writeData(null);
    } else {
      const postsStorageRef = storageRef(
        storage,
        `${STORAGE_KEY}/${file.name}`
      );
      uploadBytes(postsStorageRef, file).then(() => {
        getDownloadURL(postsStorageRef, file.name).then((url) => {
          writeData(url);
        });
      });
    }
  };

  const writeData = (url) => {
    const postsListRef = ref(database, DB_POSTS_KEY);
    const newPostsRef = push(postsListRef);
    set(newPostsRef, {
      date: Date.now(),
      url,
      user: auth.currentUser.displayName,
      caption: caption,
      likes: [],
    });
    resetCaption(0);
    setFile(null);
    setFileInputValue("");
    navigate("/feed");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileInputValue(e.target.value);
  };

  return (
    <>
      <div class="page">
        <div class="box">
          <form onSubmit={handleSubmit}>
            <button onClick={() => navigate("/feed")}>Return to feed</button>
            <p class="header">Create New Post</p>
            <div>
              <input
                type="text"
                placeholder=" Write a caption"
                name="caption"
                {...setNewCaption}
                class="input"
              />
            </div>
            <div>
              <input
                type="file"
                name="file"
                value={fileInputValue}
                onChange={(e) => handleFileChange(e)}
              />
            </div>

            <button type="submit" class="btn">
              Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Post;
