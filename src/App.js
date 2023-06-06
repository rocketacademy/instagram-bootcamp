import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Navbar } from "react-bootstrap";
import { database, storage, auth } from "./firebase";
import { onChildAdded, push, ref, set, remove } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Newsfeed from "./Components/Newsfeed";
import Composer from "./Components/Composer";
import { Link } from "react-router-dom";

const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newInput, setNewInput] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const userName = isLoggedIn
    ? user.email.split("@")[0].charAt(0).toUpperCase() +
      user.email.split("@")[0].slice(1)
    : null;

  const logInMessage = `Signed in as: ${userName}`;

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    });

    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        setIsLoggedIn(true);
        setUser(user); // Set the user object
      } else {
        setIsLoggedIn(false);
        setUser({});
      }
    });
  }, []); // Add isLoggedIn as a dependency

  const writeData = (url) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      text: newInput,
      date: new Date().toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      url: url,
      author: userName,
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
      <Navbar>
        {/* <Link to="/newsfeed">Newsfeed</Link> */}

        <Container>
          {isLoggedIn ? (
            <Navbar.Brand>
              Welcome back <b>{userName}</b>!
            </Navbar.Brand>
          ) : (
            <Navbar.Brand>Welcome to Caleb's IG Clone!</Navbar.Brand>
          )}
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {isLoggedIn ? (
              <div className="d-flex align-items-center">
                {/* <Navbar class="Text" style={{ marginRight: "10px" }}>
                  {logInMessage}
                </Navbar> */}
                <Button
                  className="btn-sm btn btn-link"
                  style={{ marginRight: "10px" }}
                  as={Link}
                  to="/purenewsfeed"
                >
                  Newsfeed
                </Button>
                <Button
                  className="btn-sm btn btn-link"
                  style={{ marginRight: "10px" }}
                  as={Link}
                  to="/chat"
                >
                  Chat
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={(e) => {
                    setIsLoggedIn(false);
                    signOut(auth);
                    setUser({});
                  }}
                >
                  Sign Out
                </Button>
              </div>
            ) : null}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div id="Auth-Div">
        {isLoggedIn ? (
          <Container
            className="d-flex align-items-center justify-content-center w-100 mt-4 mb-4"
            style={{
              maxWidth: "500px",
            }}
          ></Container>
        ) : (
          <Container
            className="d-flex align-items-center justify-content-center w-100 mt-4 mb-4"
            style={{
              maxWidth: "500px",
            }}
          >
            <Link to="/authForm">Sign Up/In Here To Post!</Link>
          </Container>
        )}
      </div>
      <div id="Newsfeed-Div">
        <Newsfeed messages={messages} user={user} isLoggedIn={isLoggedIn} />
      </div>
      <div id="Composer-Div">
        {isLoggedIn ? (
          <Composer
            newInput={newInput}
            handleChange={handleChange}
            submit={submit}
            imageUploadSetState={imageUploadSetState}
            fileInputValue={fileInputValue}
            deleteData={deleteData}
            messages={messages}
          />
        ) : null}
      </div>
    </div>
  );
};

export default App;
