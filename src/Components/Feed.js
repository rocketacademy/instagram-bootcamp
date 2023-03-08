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
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import PostForm from "./PostForm.js";
import { Outlet } from "react-router-dom";
import { UserContext } from "../App.js";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_IMAGES_KEY = "images";

export default function Feed(props) {
  const inputRef = useRef(null);
  const user = useContext(UserContext);
  // Initialised local state. When Firebase changes, local state is updated.
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileInput, setFileInput] = useState(null);

  useEffect(() => {
    console.log("on load", user.email);
    loadMessages(user);
  }, []);

  useEffect(() => {
    console.log("user changed to", user.email);
    console.log("loaded?", loaded);
    if (loaded && messages.length > 0) {
      updateMessages(user);
    }
  }, [user.email]);

  const loadMessages = (currentUser) => {
    const messagesRef = dbRef(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      const currentUserEmail = currentUser.email;
      const likedUsers = data.val().likedUsers;
      const likedByCurrentUser = (likedUsers || []).includes(currentUserEmail);
      setMessages((messages) => [
        ...messages,
        {
          key: data.key,
          message: data.val().message,
          timestamp: data.val().timestamp,
          fileDownloadURL: data.val().fileDownloadURL,
          authorEmail: data.val().authorEmail,
          authorID: data.val().authorID,
          likes: data.val().likes,
          likedUsers: likedUsers,
          likedByCurrentUser: likedByCurrentUser,
          likeButtonColor: likedByCurrentUser ? "#ff5151" : "#ffb5b5",
        },
      ]);
    });
    setLoaded(true);
  };

  const updateMessages = (currentUser) => {
    console.log("current user", currentUser);
    const messagesToUpdate = [...messages];
    for (const message of messagesToUpdate) {
      message.likedByCurrentUser = (message.likedUsers || []).includes(
        currentUser.email
      );
      console.log("updating to", message.likedByCurrentUser);
      message.likeButtonColor = message.likedByCurrentUser
        ? "#ff5151"
        : "#ffb5b5";
    }
    setMessages(messagesToUpdate);
    console.log("called update message");
  };

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
      timestamp: timestamp,
      fileDownloadURL: url,
      likes: 0,
      likedUsers: [""],
      authorEmail: user.email,
      authorID: user.uid,
    });
  };

  const renderMessageItems = () => {
    let messageListItems = messages.map((item, index) => (
      <Card key={item.key}>
        <Card.Img
          variant="top"
          key={`${item.key}-img`}
          src={item.fileDownloadURL}
          alt={item.message}
          id={item.key}
          onClick={props.onClick}
        />
        <Card.Text key={`${item.key}-m`} className="message">
          {item.message}
        </Card.Text>
        <Card.Footer key={`${item.key}-ft`}>
          <div className="footer-data">
            <div key={`${item.key}-ts`} className="timestamp">
              {item.timestamp}
            </div>
            <div className="auth-email">{item.authorEmail}</div>
          </div>
          <div className="like-item">
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 350 }}
              overlay={
                <Tooltip key={`${item.key}-tt`}>
                  {item.likedUsers.slice(1).map((user) => (
                    <div className="liked-users" key={user}>
                      {user}
                    </div>
                  ))}
                </Tooltip>
              }
            >
              <div className="likes">{item.likes}</div>
            </OverlayTrigger>
            <Button
              name={item.key}
              className="like-btn"
              variant="outline-danger"
              onClick={handleLike}
              disabled={!user.email}
              style={{ color: item.likeButtonColor }}
            >
              ♥
            </Button>
          </div>
        </Card.Footer>
      </Card>
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
    setTimestamp(new Date().toLocaleString("en-GB"));
    e.preventDefault();
    if (message.length === 0 || !fileInput) {
      alert("Upload something and write a message!");
      return;
    }

    uploadFile()
      .then(writeData)
      .then(() => {
        setMessage("");
        setTimestamp("");
        setFileName("");
        setFileInput(null);
        console.log(inputRef);
        inputRef.current.value = "";
      });
  };

  const handleLike = (e) => {
    let currentLikes;
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
      currentLikes = parseInt(snapshot.val().likes);
      currentLikedUsers = snapshot.val().likedUsers;
    });
    if (!likedMessage.likedByCurrentUser) {
      update(likedMessageRef, {
        likes: currentLikes + 1,
        likedUsers: [...currentLikedUsers, user.email],
      });
      likedMessage.likes += 1;
      likedMessage.likedUsers = [...likedMessage.likedUsers, user.email];
      likedMessage.likedByCurrentUser = true;
      likedMessage.likeButtonColor = "#ff5151";
    } else {
      update(likedMessageRef, {
        likes: currentLikes - 1,
        likedUsers: [...currentLikedUsers.slice(0, -1)],
      });
      likedMessage.likes -= 1;
      likedMessage.likedUsers = [...likedMessage.likedUsers].filter(
        (userEmail) => userEmail !== user.email
      );
      likedMessage.likedByCurrentUser = false;
      likedMessage.likeButtonColor = "#ffb5b5";
    }
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
