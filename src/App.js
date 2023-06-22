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

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling

const DB_STUDENTS_KEY = "students";
const STORAGE_STUDENTS_KEY = "students/";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      students: [],
      name: "",
      fileInputFile: null,
      fileInputValue: "",
      isLoggedIn: false,
      user: {},
      email: "",
      password: "",
    };
  }

  handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value,
    });
  };

  handleSignup = () => {
    createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
      .then((userCred) => {})
      .catch((err) => {
        alert(err);
      });
  };

  handleLogin = () => {
    signInWithEmailAndPassword(auth, this.state.email, this.state.password)
      .then((userCred) => {})
      .catch((err) => {
        alert(err);
      });
  };

  handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("Signout success woooo");
    });
  };

  componentDidMount() {
    const studentsRef = databaseRef(database, DB_STUDENTS_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(studentsRef, (data) => {
      console.log(data);
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        students: [...state.students, { key: data.key, val: data.val() }],
      }));
    });

    // handle state when a child is removed
    onChildRemoved(studentsRef, (data) => {
      let StudentArray = [...this.state.students];
      let NewStudentArray = StudentArray.filter(
        (item) => item.key !== data.key
      );
      this.setState({
        students: NewStudentArray,
      });
    });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        this.setState({ isLoggedIn: true, user: user });
      } else {
        this.setState({ isLoggedIn: false, user: {} });
      }
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const studentListRef = databaseRef(database, DB_STUDENTS_KEY);
    const newStudentRef = push(studentListRef);

    console.log(this.state.fileInputFile);

    const storageRefInstance = storageRef(
      storage,
      STORAGE_STUDENTS_KEY + this.state.fileInputFile.name
    );
    // 1
    uploadBytes(storageRefInstance, this.state.fileInputFile).then(
      (snapshot) => {
        console.log(snapshot);
        console.log("uploaded image");
        //2
        getDownloadURL(storageRefInstance).then((url) => {
          console.log(url);
          console.log(storageRefInstance._location.path_);
          console.log("submission:", this.state.user);
          // 3
          set(newStudentRef, {
            name: this.state.name,
            date: new Date().toLocaleString(),
            url: url,
            ref: String(storageRefInstance),
            user: this.state.user.email,
          });

          this.setState({
            name: "",
            fileInputFile: null,
            fileInputValue: "",
          });
        });
      }
    );
  };

  render() {
    // Convert messages in state to message JSX elements to render

    let studentListItems = this.state.students.map((student) => (
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

              deleteObject(ImageToDeleteRef).then(() =>
                console.log("deleted?")
              );

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
          {!this.state.isLoggedIn ? (
            <div>
              <label>Email</label>
              <input
                value={this.state.email}
                name="email"
                type="text"
                placeholder="email here please"
                onChange={this.handleInput}
              />
              <label>Password</label>
              <input
                value={this.state.password}
                name="password"
                type="text"
                placeholder="password here please"
                onChange={this.handleInput}
              />
              <button onClick={this.handleLogin}>Login</button>
              <button onClick={this.handleSignup}>Signup</button>
            </div>
          ) : (
            <div>
              <button onClick={this.handleSignOut}>Log me out!</button>
            </div>
          )}

          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>

          {this.state.isLoggedIn ? (
            <div>
              <h2>Welcome back {this.state.user.email}</h2>
              <input
                type="text"
                value={this.state.name}
                onChange={(e) => {
                  this.setState({
                    name: e.target.value,
                  });
                }}
                placeholder="Add a name here"
              />

              <input
                type="file"
                value={this.state.fileInputValue}
                onChange={(e) => {
                  console.log(e.target.value);
                  this.setState({
                    fileInputFile: e.target.files[0],
                    fileInputValue: e.target.value,
                  });
                }}
                placeholder="add file here"
              />
              <button onClick={this.writeData}>Send</button>
            </div>
          ) : null}
          {studentListItems}
        </header>
      </div>
    );
  }
}

export default App;
