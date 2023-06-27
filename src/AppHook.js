import React from "react";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  remove,
  onChildRemoved,
} from "firebase/database";
import {
  getDownloadURL,
  uploadBytes,
  deleteObject,
  ref as storageRef,
} from "firebase/storage";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { database, storage, auth } from "./firebase";
import logo from "./logo.png";
import "./App.css";

import { useState, useEffect } from "react";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling

const DB_STUDENTS_KEY = "students";
const STORAGE_STUDENTS_KEY = "students/";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  const [fileInputValue, setFileInputValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {})
      .catch((err) => {
        alert(err);
      });
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {})
      .catch((err) => {
        alert(err);
      });
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("Signout success woooo");
    });
  };

  useEffect(() => {
    const studentsRef = databaseRef(database, DB_STUDENTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(studentsRef, (data) => {
      console.log(data);
      setStudents((prevState) => [
        ...prevState,
        { key: data.key, val: data.val() },
      ]);
    });

    // handle state when a child is removed
    onChildRemoved(studentsRef, (data) => {
      let StudentArray = [...students];
      let NewStudentArray = StudentArray.filter(
        (item) => item.key !== data.key
      );
      setStudents(NewStudentArray);
    });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser({});
      }
    });
  }, []);

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  const writeData = () => {
    const studentListRef = databaseRef(database, DB_STUDENTS_KEY);
    const newStudentRef = push(studentListRef);

    console.log(fileInputFile);

    const storageRefInstance = storageRef(
      storage,
      STORAGE_STUDENTS_KEY + fileInputFile.name
    );
    // 1
    uploadBytes(storageRefInstance, fileInputFile).then((snapshot) => {
      console.log(snapshot);
      console.log("uploaded image");
      //2
      getDownloadURL(storageRefInstance).then((url) => {
        console.log(url);
        console.log(storageRefInstance._location.path_);
        console.log("submission:", user);
        // 3
        set(newStudentRef, {
          name: name,
          date: new Date().toLocaleString(),
          url: url,
          ref: String(storageRefInstance),
          user: user.email,
        });

        setName("");
        setFileInputFile(null);
        setFileInputValue("");
      });
    });
  };

  let studentListItems = students.map((student) => (
    <div key={student.key}>
      <h3>
        {student.val.date}- {student.val.name}
      </h3>
      <div>
        <h4>{student.val.user}</h4>
        <img
          style={{ height: "50vh" }}
          src={student.val.url}
          alt={student.val.name}
        />
        <br />
        <button
          onClick={(e) => {
            // delete the image stored in storage
            const ImageToDeleteRef = storageRef(storage, student.val.ref);

            deleteObject(ImageToDeleteRef).then(() => console.log("deleted?"));

            // delete the entry wihtin the real time database.
            const itemToDelete = databaseRef(
              database,
              "students/" + student.key
            );

            remove(itemToDelete).then(() => console.log("success"));
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ));

  return (
    <div className="App">
      <header className="App-header">
        {!isLoggedIn ? (
          <div>
            <label>Email</label>
            <input
              value={email}
              name="email"
              type="text"
              placeholder="email here please"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              value={password}
              name="password"
              type="text"
              placeholder="password here please"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignup}>Signup</button>
          </div>
        ) : (
          <div>
            <button onClick={handleSignOut}>Log me out!</button>
          </div>
        )}

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        {isLoggedIn ? (
          <div>
            <h2>Welcome back {user.email}</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Add a name here"
            />

            <input
              type="file"
              value={fileInputValue}
              onChange={(e) => {
                setFileInputFile(e.target.files[0]);
                setFileInputValue(e.target.value);
              }}
              placeholder="add file here"
            />
            <button onClick={writeData}>Send</button>
          </div>
        ) : null}

        {studentListItems}
      </header>
    </div>
  );
}

export default App;
