import { React, useState, useEffect } from "react";
import "./App.css";

// Firebase tools
import { database, storage, auth } from "./firebase";
import {
  onChildAdded,
  onChildRemoved,
  push,
  remove,
  ref,
  update,
} from "firebase/database";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getDownloadURL,
  ref as storeRef,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

// Components
import Post from "./Components/Post/Post";
import SignUpForm from "./Components/SignUpForm";
import PostComposer from "./Components/PostComposer";

// Firebase paths
const DB_POSTS_KEY = "posts";
const DB_IMAGES_KEY = "images";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [uid, setUid] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  let postFeedScroll;

  // Initialise listeners
  useEffect(() => {
    const postsRef = ref(database, DB_POSTS_KEY);

    onChildAdded(postsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setPosts((prevPosts) => [
        ...prevPosts,
        { key: data.key, val: data.val() },
      ]);
    });
    // onChildAdded will return data for every child at the reference and every subsequent new child

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

  // Auto scroll to bottom
  useEffect(() => {
    postFeedScroll.scrollIntoView({ behavior: "smooth" });
  }, [postFeedScroll]);

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
      const index = posts.indexOf(likedPost);
      if (likedPost.val.likes[uid]) {
        delete likedPost.val.likes[uid];
      } else {
        likedPost.val.likes[uid] = true;
      }

      update(ref(database), { [postRef]: likedPost.val });
      const postCopy = [...posts];
      postCopy.splice(index, 1, likedPost);
      setPosts(postCopy);
    }
  };

  const handleSignUp = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password);
  };

  const handleLogIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogOut = () => {
    signOut(auth);
    setUid(null);
    setUserEmail(null);
  };

  let postFeed = posts.map((post) => (
    <Post
      key={post.key}
      handleDelete={handleDelete}
      handleLikes={handleLikes}
      creator={post.val.creator}
      uid={uid}
    >
      {post}
    </Post>
  ));

  return (
    <div className="App">
      <div className="phone">
        <div id="header">
          <h1>Instasham</h1>
          {uid ? (
            <div>
              <p>{userEmail}</p>
              <button onClick={handleLogOut}>Log Out</button>
            </div>
          ) : (
            <SignUpForm handleSignUp={handleSignUp} handleLogIn={handleLogIn} />
          )}
        </div>

        <ul className="posts">
          {postFeed}
          <li
            ref={(e) => {
              postFeedScroll = e;
            }}
          ></li>
        </ul>
        <PostComposer
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          handleChange={handleChange}
          file={file}
          input={input}
        />
      </div>
    </div>
  );
};

export default App;
