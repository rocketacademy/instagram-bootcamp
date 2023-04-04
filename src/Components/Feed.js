import React, { useState, useEffect, useContext, useRef } from "react";
import {
  onChildAdded,
  push,
  ref as dbRef,
  set,
  onValue,
  update,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../firebase.js";
import PostForm from "./PostForm.js";
import { Outlet } from "react-router-dom";
import { UserContext } from "../App.js";
import PostCard from "./PostCard.js";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_IMAGES_KEY = "images";

export default function Feed() {
  const inputRef = useRef(null);
  const user = useContext(UserContext);
  // Initialised local state. When Firebase changes, local state is updated.
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileInput, setFileInput] = useState(null);

  useEffect(() => {
    const messagesRef = dbRef(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      setMessages((messages) => [
        ...messages,
        {
          key: data.key,
          message: data.val().message,
          timestamp: data.val().timestamp,
          fileDownloadURL: data.val().fileDownloadURL,
          authorEmail: data.val().authorEmail,
          authorID: data.val().authorID,
          likedUsers: data.val().likedUsers,
        },
      ]);
    });
  }, []);

  const uploadFile = () => {
    const fileRef = storageRef(storage, `${STORAGE_IMAGES_KEY}/${fileName}`);
    return uploadBytesResumable(fileRef, fileInput)
      .then((snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      })
      .then(() => getDownloadURL(fileRef))
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = errorCode.split("/")[1].replaceAll("-", " ");
        alert(`Wait a minute... an error occurred: ${errorMessage}`);
      });
  };

  const writeData = (url) => {
    const messageListRef = dbRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    return set(newMessageRef, {
      message: message,
      timestamp: new Date().toLocaleString("en-GB"),
      fileDownloadURL: url,
      likedUsers: [""],
      authorEmail: user.email,
      authorID: user.uid,
    });
  };

  const renderMessageItems = () => {
    let messageListItems = messages.map((item, index) => (
      <PostCard
        key={index}
        item={item}
        like={handleLike}
        unlike={handleUnlike}
      />
    ));
    return messageListItems;
  };

  const handleTextChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFileChange = (e) => {
    setFileInput(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleSubmit = (e) => {
    // setTimestamp(new Date().toLocaleString("en-GB"));
    e.preventDefault();
    if (message.length === 0 || !fileInput) {
      alert("Upload something and write a message!");
      return;
    }
    uploadFile()
      .then(writeData)
      .then(() => {
        setMessage("");
        setFileName("");
        setFileInput(null);
        console.log(inputRef);
        inputRef.current.value = "";
      });
  };

  const handleLike = (e) => {
    let currentLikedUsers;
    const messagesToUpdate = [...messages];
    const indexOfLiked = messagesToUpdate
      .map((message) => message.key)
      .indexOf(e.target.name);
    const likedMessage = messagesToUpdate[indexOfLiked];
    const likedMessageRef = dbRef(
      database,
      `${DB_MESSAGES_KEY}/${e.target.name}`
    );
    onValue(likedMessageRef, (snapshot) => {
      currentLikedUsers = snapshot.val().likedUsers;
    });
    update(likedMessageRef, {
      likedUsers: [...currentLikedUsers, user.email],
    });
    likedMessage.likedUsers = [...likedMessage.likedUsers, user.email];
    setMessages(messagesToUpdate);
  };

  const handleUnlike = (e) => {
    let currentLikedUsers;
    const messagesToUpdate = [...messages];
    const indexOfLiked = messagesToUpdate
      .map((message) => message.key)
      .indexOf(e.target.name);
    const likedMessage = messagesToUpdate[indexOfLiked];
    const likedMessageRef = dbRef(
      database,
      `${DB_MESSAGES_KEY}/${e.target.name}`
    );
    onValue(likedMessageRef, (snapshot) => {
      currentLikedUsers = snapshot.val().likedUsers;
    });
    update(likedMessageRef, {
      likedUsers: [...currentLikedUsers.slice(0, -1)],
    });
    likedMessage.likedUsers = [...likedMessage.likedUsers].filter(
      (userEmail) => userEmail !== user.email
    );
    setMessages(messagesToUpdate);
  };

  return (
    <div className="feed">
      <div className="container">
        {renderMessageItems()}
        {user.email && (
          <PostForm
            handleFileChange={handleFileChange}
            handleTextChange={handleTextChange}
            message={message}
            inputRef={inputRef}
            handleSubmit={handleSubmit}
          />
        )}
        <Outlet />
      </div>
    </div>
  );
}
