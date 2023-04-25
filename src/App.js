import { React, useState, useEffect } from "react";
import "./App.css";

// Firebase tools
import { database, storage, auth } from "./firebase";
import {
  onChildAdded,
  onChildRemoved,
  onChildChanged,
  push,
  remove,
  ref,
  update,
} from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  getDownloadURL,
  ref as storeRef,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

// Components
import Home from "./Components/Home";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./Components/Login/Login";

// Firebase paths
const DB_POSTS_KEY = "posts";
const DB_IMAGES_KEY = "images";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [uid, setUid] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Initialise listeners
  useEffect(() => {
    const postsRef = ref(database, DB_POSTS_KEY);

    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setPosts((prevPosts) => [
        ...prevPosts,
        { key: data.key, val: data.val() },
      ]);
    });

    onChildChanged(postsRef, (data) => {
      setPosts((prevPosts) => {
        const likedPost = prevPosts.filter((post) => post.key === data.key)[0];
        const index = prevPosts.indexOf(likedPost);
        const postCopy = [...prevPosts];
        postCopy.splice(index, 1, likedPost);
        return postCopy;
      });
    });

    onChildRemoved(postsRef, (data) => {
      // const remainingPosts = posts.filter((post) => post.key !== data.key);
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.key !== data.key)
      );
    });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setUserEmail(user.email);
      }
    });
  }, []);

  // Helper Functions
  const writeData = (message, file) => {
    const postListRef = ref(database, DB_POSTS_KEY);
    const date = new Date();
    const postLog = {
      creator: "Anonymous",
      uid: null,
      content: message,
      date: JSON.stringify(date),
      likes: {
        placeholder: "",
      },
    };
    if (userEmail) {
      postLog.creator = userEmail;
      postLog.uid = uid;
    }
    if (file) {
      const imageRef = storeRef(storage, `${DB_IMAGES_KEY}/${file.name}`);
      //Images upload
      uploadBytesResumable(imageRef, file).then(() => {
        getDownloadURL(imageRef).then((url) => {
          postLog.imgURL = url;
          push(postListRef, postLog);
        });
      });
    } else {
      push(postListRef, postLog);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await writeData(input, file);
    setInput("");
    setFile(null);
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDelete = (e) => {
    const post = e.target.parentElement;
    const id = post.id;
    const postRef = ref(database, `${DB_POSTS_KEY}/${id}`);
    if (post.querySelector(".post-image")) {
      const imgURL = post.querySelector(".post-image").src;
      const imageRef = storeRef(storage, imgURL);
      deleteObject(imageRef);
    }
    remove(postRef);
  };

  const handleLikes = (e) => {
    if (uid) {
      const id = e.target.offsetParent.id;
      const postRef = DB_POSTS_KEY + "/" + id;
      const likedPost = posts.filter((post) => post.key === id)[0];
      if (likedPost.val.likes[uid]) {
        delete likedPost.val.likes[uid];
      } else {
        likedPost.val.likes[uid] = true;
      }
      update(ref(database), { [postRef]: likedPost.val });
    }
  };

  const handleLogOut = () => {
    signOut(auth);
    setUid(null);
    setUserEmail(null);
  };

  return (
    <div className="App">
      <div className="phone">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                handleSubmit={handleSubmit}
                handleFileChange={handleFileChange}
                handleChange={handleChange}
                handleDelete={handleDelete}
                handleLikes={handleLikes}
                handleLogOut={handleLogOut}
                uid={uid}
                userEmail={userEmail}
                posts={posts}
                file={file}
                input={input}
              ></Home>
            }
          />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
