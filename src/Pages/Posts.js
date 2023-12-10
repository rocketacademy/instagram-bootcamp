import { onChildAdded, push, ref, set } from "firebase/database";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, database, auth } from "../firebase.js";
import { useState, useEffect } from "react";
import "../App.css";

import NavBar from "../Components/NavBar.js";

const DB_POSTS_KEY = "posts";

const Posts = () => {
  const [postCaption, setPostCaption] = useState("");
  const [postImageFile, setPostImageFile] = useState(null);
  const [postImageValue, setPostImageValue] = useState("");
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("noUser");
  const [userDisplayName, setUserDisplayName] = useState("noUserDisplayName");

  useEffect(() => {
    let loadedPosts = [];
    const postsCaptionsRef = ref(database, `${user}/${DB_POSTS_KEY}`);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    const unsubscribe = onChildAdded(postsCaptionsRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      let value = data.val();
      loadedPosts = [...loadedPosts, { key: data.key, val: value }];
      setPosts(loadedPosts);
    });
    return () => {
      unsubscribe();
    };
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (auth.currentUser === null) {
        return () => {
          setUser("noUser");
          setUserDisplayName("noUserDisplayName");
        };
      }
      setUser(auth.currentUser.uid);
      setUserDisplayName(auth.currentUser.displayName);
    });
    return () => {
      unsubscribe();
    };
  });

  const writeData = (imgUrl) => {
    const postsRef = ref(database, `${user}/${DB_POSTS_KEY}`);
    const newPostsRef = push(postsRef);
    let newDate = new Date() - 0;
    set(newPostsRef, {
      caption: postCaption,
      date: newDate,
      name: auth.currentUser.displayName,
      url: imgUrl,
    }).then(() => {
      setPostCaption("");
      setPostImageFile(null);
      setPostImageValue("");
    });
  };

  const post = () => {
    const postsImagesRef = sRef(storage, `${user}/${postImageFile.name}`);
    uploadBytes(postsImagesRef, postImageFile).then(() => {
      const url = getDownloadURL(postsImagesRef, postImageFile.name);
      url.then((value) => {
        writeData(value);
      });
    });
  };

  const handleChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleImage = (e) => {
    setPostImageFile(e.target.files[0]);
    setPostImageValue(e.target.file);
  };

  const postListItems = posts.map((post) => (
    <div className="post-container" key={post.key}>
      <p>{post.val.name}</p>
      <p>
        {new Date(post.val.date).toLocaleTimeString()},
        {new Date(post.val.date).toLocaleDateString()}
      </p>
      <p>{post.val.caption}</p>
      <div className="post-thumbnail">
        <img alt="" src={post.val.url} />
      </div>
    </div>
  ));

  return (
    <div className="App">
      <header className="App-header row">
        <NavBar />
        <h4>
          {auth.currentUser === null
            ? "Please login."
            : `Currently logged in as: ${userDisplayName}`}
        </h4>
        {auth.currentUser !== null && (
          <div>
            <span>Enter post caption: </span>
            <input
              type="text"
              name="caption"
              value={postCaption}
              onChange={(e) => handleChange(e, setPostCaption)}
            ></input>
            <br />
            <span>Enter post image: </span>
            <input
              type="file"
              name="image"
              onChange={(e) => handleImage(e)}
            ></input>
            <br />
            <button onClick={post}>Post</button>
          </div>
        )}
        {/* display post thumbnails */}
        {auth.currentUser === null ? (
          "Your posts will be displayed when you log in."
        ) : (
          <div className="posts">{postListItems}</div>
        )}
      </header>
    </div>
  );
};

export default Posts;
