import React, { useState, useEffect } from "react";
import { onChildAdded, push, ref, set, remove } from "firebase/database";
import { database, storage } from "./firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./Components/Signup";
import Newsfeed from "./Components/Newsfeed";
import Composer from "./Components/Composer";

const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newInput, setNewInput] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  const writeData = (url) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      text: newInput,
      date: new Date().toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
      }),
      url: url,
    });
    setNewInput("");
    setFileInputFile(null);
    setFileInputValue("");
  };

  const deleteData = () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete all data?"
    );
    if (confirmation) {
      const messageListRef = ref(database, DB_MESSAGES_KEY);
      remove(messageListRef)
        .then(() => {
          console.log("Data deleted successfully.");
          setMessages([]);
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
        });
    }
  };

  const submit = () => {
    const fullStorageRef = storageRef(
      storage,
      STORAGE_KEY + "/" + fileInputFile.name
    );
    uploadBytes(fullStorageRef, fileInputFile).then((snapshot) => {
      getDownloadURL(fullStorageRef, fileInputFile.name).then((url) => {
        writeData(url);
      });
    });
  };

  const handleChange = (e) => {
    setNewInput(e.target.value);
  };

  const imageUploadSetState = (e) => {
    setFileInputFile(e.target.files[0]);
    setFileInputValue(e.target.value);
  };

  return (
    <div>
      <Signup />

      <Newsfeed messages={messages} />

      <Composer
        newInput={newInput}
        handleChange={handleChange}
        submit={submit}
        imageUploadSetState={imageUploadSetState}
        fileInputValue={fileInputValue}
        deleteData={deleteData}
        messages={messages}
      />
    </div>
  );
};

export default App;
