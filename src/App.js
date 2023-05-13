import React from "react";
import {
  onChildAdded,
  push,
  ref,
  set,
  remove,
  onChildRemoved,
  onValue,
} from "firebase/database";
import {
  getDownloadURL,
  ref as storeRef,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import { database } from "./firebase";
import { storage } from "./firebase";
import { auth } from "./firebase";
/* import logo from "./logo.png"; */
import "./App.css";
import SignUpForm from "./SignUpForm";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORE_IMAGE_KEY = "images";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      message: "",

      fileInputFile: null, //these are for the file upload
      fileInputValue: "",

      uid: null,
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log("this is the signed in user:", user);
        const uid = user.uid;
        this.setState({
          uid: uid,
          userEmail: user.email,
        });
      } else {
        this.setState({
          uid: null,
          userEmail: null,
        });
      }
    });

    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      console.log("Message added:", data.val());

      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [
          ...state.messages,
          { key: data.key, txt: data.val().txt, url: data.val().url },
        ],
      }));
    });
    onChildRemoved(messagesRef, (data) => {
      console.log("Message Removed:", data.val());
      //use array.filter() to remove a single message:

      const remainingMessages = this.state.messages.filter(
        (message) => message.key !== data.key
      );
      this.setState({
        messages: remainingMessages,
      });
      console.log("remaining tasks:", remainingMessages);
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    //Upload my file to the storage:
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    const msg = {
      url: null,
      txt: this.state.message,
    };

    if (this.state.fileInputFile) {
      const fileRef = storeRef(
        storage,
        `${STORE_IMAGE_KEY}/${this.state.fileInputFile.name}`
      );
      uploadBytesResumable(fileRef, this.state.fileInputFile).then(() => {
        getDownloadURL(fileRef)
          .then((url) => {
            console.log("URL:", url);
            msg.url = url;
          })
          .then(() => {
            push(messageListRef, msg);
            //Reset input field after writing/submitting
            this.setState({
              message: "",
              fileInputFile: null,
            });
          });
      });
    } else {
      push(messageListRef, msg);
    }

    //Adding new message to the realtime Database:
  };

  handleSignup = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password).catch((err) => {
      console.log("error", err);
      /*  alert('error code:', err.code, 'msg:'.err.message) */
    });
  };

  handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password).catch((err) => {
      console.log("error", err);
      /* alert('error code:', err.code, 'msg:'.err.message) */
    });
  };

  handleLogOut = () => {
    signOut(auth).then(() => {
      this.setState({
        uid: null,
        userEmail: null,
      });
    });
  };

  handleChange = (e) => {
    this.setState({
      message: e.target.value,
    });
  };

  handleFileChange = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      fileInputFile: e.target.files[0],
      fileInputValue: e.target.value
    });
  };

  handleDelete = (e) => {
    const { id } = e.target;
    console.log(id);
    const messageRef = ref(database, `${DB_MESSAGES_KEY}/${id}`);
    remove(messageRef);
  };

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <li key={message.key}>
        <img style={{ width: "10vw" }} src={message.url} />
        <p>{message.txt}</p>
        <button id={message.key} onClick={this.handleDelete}>
          Delete
        </button>
      </li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          {this.state.uid ? (
            <div>
              <h2>Welcome back {this.state.userEmail}!!!</h2>
              <br />
              <button onClick={this.handleLogOut}>Logout</button>
            </div>
          ) : (
            <SignUpForm
              auth={auth}
              handleSignup={this.handleSignup}
              handleLogin={this.handleLogin}
            />
          )}

          {/*   <img src={logo} className="App-logo" alt="logo" /> */}
          <br />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <input
            id="imgInput"
            name="image"
            type="file"
            onChange={this.handleFileChange}
          /*  value={this.state.fileInputFile} */
          //e.target.files is a Filelist object that is an array of file objects
          //e.target.files[0] is a File object that Firebase Storage can upload
          />

          <input
            id="messageInput"
            type="text"
            placeholder="Type your message here"
            name="message"
            onChange={this.handleChange}
            value={this.state.message}
          />

          <button onClick={this.writeData}>Send</button>

          <ul>{messageListItems}</ul>
        </header>
      </div>
    );
  }
}

export default App;
