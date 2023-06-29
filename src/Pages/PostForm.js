import { useState } from "react";
import { push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";
import { TextField, Button } from "@mui/material";
import { UserContext } from "../App";
import { useContext } from "react";
import PostList from "./PostList";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POSTS_KEY = "posts";
const STORAGE_KEY = "images/";

export default function PostForm() {
  const [post, setPost] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const user = useContext(UserContext);

  // Note use of array fields syntax to avoid having to manually bind this method to the class

  const writeData = (url) => {
    const postListRef = ref(database, DB_POSTS_KEY);
    const newPostRef = push(postListRef);
    set(newPostRef, {
      userID: user.displayName,
      post: post,
      date: new Date().toLocaleString(),
      url: url,
    });

    setPost("");
    setFileInputFile(null);
    setFileInputValue("");
  };

  const handleChange = (e) => {
    setPost(e.target.value);
  };

  const submit = () => {
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + fileInputFile.name
    );

    uploadBytes(fullStorageRef, fileInputFile).then((snapshot) => {
      getDownloadURL(fullStorageRef, fileInputFile.name).then((url) => {
        writeData(url);
      });
    });
  };

  return (
    <div>
      {user.isLoggedIn && user.displayName.length > 0 ? (
        <div>
          <h3>Posts for {user.displayName}</h3>
        </div>
      ) : user.isLoggedIn ? (
        <div>
          <h3>Posts</h3>
          <h4>
            You don't have a display name. Click on Profile ↗️ to set one.{" "}
          </h4>
          <p>Otherwise your post will have no name.</p>
        </div>
      ) : (
        <div>
          <h3>Posts</h3>
        </div>
      )}
      {user.isLoggedIn ? (
        <div>
          <TextField
            name="post"
            label="New Post"
            color="secondary"
            variant="standard"
            value={post}
            onChange={(e) => handleChange(e)}
            size="small"
            focused
            multiline
            minRows={1}
            required
          />
          <br />
          <TextField
            type="file"
            name="file"
            color="secondary"
            variant="filled"
            size="small"
            value={fileInputValue}
            InputProps={{ sx: { height: 45 } }}
            onChange={(e) => {
              console.log(e.target);
              setFileInputFile(e.target.files[0]);
              setFileInputValue(e.target.file);
            }}
            focused
          />
          <br />
          <Button
            variant="contained"
            color="secondary"
            size="small"
            type="submit"
            value="submit"
            onClick={() => submit()}
          >
            Send
          </Button>
          <br />
        </div>
      ) : (
        <div>
          <h3>Please login if you wish to post. ↗️ </h3>
        </div>
      )}

      <div>
        <PostList />
      </div>
    </div>
  );
}
