import React, { useState, useEffect } from "react";
import { push, ref, set, onChildAdded } from "firebase/database";
import { database, storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

const Messenger = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    //onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messageListRef, (data) => {
      setMessages((message) => {
        return [...message, { key: data.key, val: data.val() }];
      });
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file && !message) return;

    if (!file) {
      writeData(null);
    } else {
      const fullStorageRef = storageRef(storage, `${STORAGE_KEY}/${file.name}`);
      uploadBytes(fullStorageRef, file).then(() => {
        getDownloadURL(fullStorageRef, file.name).then((url) => {
          writeData(url);
        });
      });
    }
  };

  const writeData = (url) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      text: message,
      date: new Date().toLocaleTimeString(),
      url,
    });
    setMessage("");
    setFileInputValue("");
    setFile(null);
  };
  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setFileInputValue(e.target.value);
  };

  const messageListItems = () => {
    return messages.map((message) => {
      return (
        <div key={message.key}>
          <div>{message.val.date}</div>
          <div>{message.val.text}</div>
          <div>
            {" "}
            {message.val.url && (
              <img src={message.val.url} alt="img" style={{ width: "30px" }} />
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div>{messageListItems()}</div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Type something..."
          name="input-text"
          type="text"
        />
        <input
          type="file"
          name="input-file"
          value={fileInputValue}
          onChange={(e) => handleChange(e)}
        />
        <input value="send" type="submit" />
      </form>
    </>
  );
};

export default Messenger;
