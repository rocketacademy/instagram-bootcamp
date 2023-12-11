import React, { useState, useEffect } from "react";
import useInput from "./hooks/useInput";
import { push, ref, set, onChildAdded } from "firebase/database";
import { database, storage, auth } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import SideBar from "./SideBar";

const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

const Messenger = () => {
  const [userMessage, setUserMessage, resetUserMessage] = useInput("");
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
    if (!file && !userMessage) return;

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
      userMessage: userMessage,
      date: new Date().toLocaleTimeString(),
      url,
      user: auth.currentUser.displayName,
    });
    resetUserMessage();
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
        <div key={message.key} class="bg-gray-300 my-2 p-2 rounded-lg">
          <div>{message.val.date}</div>
          <div>{message.val.userMessage}</div>
          <div>
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
      <div>
        <SideBar />
      </div>
      <div>
        <div class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-200 p-10">
          <div class="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg mt-20">
            <div class="flex-grow h-0 p-4 overflow-auto ">
              <div class="message-box">
                <div>{messageListItems()}</div>
              </div>
            </div>

            <div class="form">
              <form onSubmit={handleSubmit}>
                <div>
                  <input
                    {...setUserMessage}
                    placeholder="Type something..."
                    name="input"
                    type="text"
                    required
                    class="messenger-input"
                  />
                </div>
                <div>
                  <input
                    type="file"
                    name="file"
                    value={fileInputValue}
                    onChange={(e) => handleChange(e)}
                    class="w-full px-3 m-1"
                  />
                </div>
                <div>
                  <button type="submit" class="btn">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
