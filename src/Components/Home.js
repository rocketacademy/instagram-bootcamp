import React, { useEffect, useState } from "react";
import Navbar from "./Nav/Navbar";
import Sidebar from "./Nav/Sidebar";
import { useAuth } from "../AuthContext";
import { database, storage } from "../firebase";
import {
  ref as databaseRef,
  onChildAdded,
  set,
  push,
  off,
  onValue,
} from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";

function Home() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState();
  const [imageURL, setImageURL] = useState();
  const [text, setText] = useState("");

  useEffect(() => {
    document.title = "Home | Rocketgram";
  }, []);

  useEffect(() => {
    const postsRef = databaseRef(database, `posts`);
    onChildAdded(postsRef, (snapshot) => {
      setPosts([
        ...posts,
        {
          key: snapshot.key,
          text: snapshot.val().text,
          imageURL: snapshot.val().imageURL,
          image: snapshot.val().image,
          timestamp: snapshot.val().timestamp,
        },
      ]);
    });

    return () => off(postsRef);
  }, []);

  const writeData = (callback) => {
    const postsRef = databaseRef(database, "posts");
    const imagesRef = storageRef(storage, `images/${image.name}`);

    const newPostRef = push(postsRef);
    const currentDate = new Date();
    uploadBytesResumable(imagesRef, image).then(() => {
      getDownloadURL(imagesRef).then((url) => {
        setImageURL(url);
        set(newPostRef, {
          text: text,
          imageURL: url,
          timestamp: currentDate.toLocaleString("en-GB").slice(0, -3),
        });
        callback();
      });
    });
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    e.target[0].value = null;

    const finishWritingData = new Promise((res) => {
      writeData(res);
    });
    finishWritingData
      .then(() => {
        setText("");
        setImage();
      })
      .then(() => {
        alert("You have added a new post");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  function RenderPosts() {
    if (user) {
      return posts.map((post) => (
        <div key={post.key}>
          <img src={post.imageURL} alt="Post media" />
          <div>{post.text}</div>
          <div>{post.username}</div>
          <div>{post.timestamp}</div>
        </div>
      ));
    }
  }

  return (
    <div className="home-ctn">
      <Navbar />
      <div className="home-main">
        <div className="home-feed">
          <div className="post-form">
            <h2>Add Post</h2>
            <form onSubmit={handleAddPost}>
              <input
                type="file"
                name="image"
                alt="Posted image"
                onChange={(e) => setImage(e.target.files[0])}
                src={imageURL}
                required
              />
              <input
                type="text"
                name="text"
                placeholder="Add a description..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
              <button type="submit">Post</button>
            </form>
          </div>
          <div className="posts-feed">
            {posts.length === 0 ? <p>No posts yet...</p> : <RenderPosts />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
