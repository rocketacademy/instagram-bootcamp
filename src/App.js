import React from "react";
import {
  onChildAdded,
  push,
  ref,
  set,
  onChildRemoved,
  remove,
  get,
  onValue,
  update,
  onChildChanged,
} from "firebase/database";

import { realTimeDatabase, storage } from "./firebase/firebase";

import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "storedMessages"; //This corresponds to the Firebase branch/document
const STORAGE_KEY = "images/"; // This corresponds to the Firebase branch/document

class App extends React.Component {
  constructor(props) {
    super(props);

    this.chatWindow = React.createRef();

    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messageText: "",
      messages: [],
      fileURL: "",
      likes: 0,
      comments: [],

      userEmail: "",
      userPassword: "",

      currentUID: "",
      isSignedIn: false,

      fileInputFile: null,
      fileInputValue: "",
    };
  }

  componentDidMount() {
    const messagesRef = ref(realTimeDatabase, DB_MESSAGES_KEY);

    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });

    // Triggered when a Child is Removed from the Database.
    // So the functionality should be to UPDATE the STATE, to UPDATE the UI.
    onChildRemoved(messagesRef, (data) => {
      const newRemainingMessages = this.state.messages.filter(
        (message) => message.key !== data.key
      );
      this.setState({
        messages: newRemainingMessages,
      });
    });

    // Background Event Listener that is always Running
    // Firebase Method, onValue
    // onValue(messagesRef, (snapshot) => {
    //   console.log("its me , ", snapshot);
    // });

    onChildChanged(messagesRef, (snapshot) => {
      // snapshot is specifically just the child in firebase that you edited. The typeof is snapshot.
      // will need to use .key or .val() to get meaningful information.
      // console.log(snapshot);

      // console.log("default messages: ", this.state.messages);

      const replaceIndex = this.state.messages.findIndex(
        (message) => message.key === snapshot.key
      );

      const existingMessages = this.state.messages;
      const updatedMessage = { key: snapshot.key, val: snapshot.val() };

      existingMessages.splice(replaceIndex, 1, updatedMessage);
      this.setState({
        messages: existingMessages,
      });
    });
  }

  handleTextChange = (ev) => {
    let { name, value } = ev.target;
    // const name = ev.target.name;
    // const value = ev.target.value;

    // console.log("this is name: ", name);
    this.setState({
      [name]: value,
    });
  };

  handleDelete = (ev) => {
    const messageToDelete = ref(
      realTimeDatabase,
      `${DB_MESSAGES_KEY}/${ev.target.id}`
    );

    remove(messageToDelete);
  };

  handleIncrementLike = (ev) => {
    // The id is message.key, that is from that instance of message.

    const childToIncrementLike = ref(
      realTimeDatabase,
      `${DB_MESSAGES_KEY}/${ev.target.id}`
    );

    get(childToIncrementLike).then((snapshot) => {
      const data = snapshot.val();
      set(childToIncrementLike, {
        text: data.text,
        timestamp: data.timestamp,
        fileURL: data.fileURL,
        likes: data.likes + 1,
      });
    });
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    // ev.preventDefault();

    if (this.state.messageText !== "") {
      const messageListRef = ref(realTimeDatabase, DB_MESSAGES_KEY);
      const newMessageRef = push(messageListRef); // Sets a key - assigned by Firebase - for a NEW branch in Firebase
      // Need to seperate per user, give it an ID and create a new item in the list
      set(newMessageRef, {
        text: this.state.messageText,
        timestamp: new Date().toTimeString(),
        fileURL: "photoURL",

        likes: this.state.likes,
        comments: this.state.comments,

        userUID: this.state.currentUID,
        userEmail: this.state.userEmail,
      });

      // console.log(this.state.messages);
      this.scrollToBottom();
    }

    // Reset Input Field Value
    this.setState({
      messageText: "",
    });
  };

  submitData = () => {
    // console.log("start storage key: ", STORAGE_KEY);
    // console.log(this.state.fileInputFile);
    // console.log(this.state.fileInputFile.name);

    // Create a reference to the full path of the file. This path will be used to upload to Firebase Storage
    const storageRef = sRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );

    console.log("ok");

    uploadBytes(storageRef, this.state.fileInputFile).then((snapshot) => {
      console.log("uploaded a file!");
      getDownloadURL(storageRef, this.state.fileInputFile.name).then(
        (fileUrl) => this.writeData(fileUrl)
      );
    });
  };

  loginSubmit = () => {
    const auth = getAuth();
    if (this.state.isSignedIn === false) {
      createUserWithEmailAndPassword(
        auth,
        this.state.userEmail,
        this.state.userPassword
      ).then((userInfo) => {
        // Will be signed in, and return the userInfo branch from Firebase Auth.
        // Q: What does this "signed-in" mean? Is there a second channel connecting to Firebase Auth that becomes active when Signed In?
        const user = userInfo.user;

        this.setState({
          currentUID: user.uid,
          isSignedIn: true,
          userPassword: "",
        });
      });
    }
  };

  loginSubmitExisting = () => {
    const auth = getAuth();
    if (this.state.isSignedIn === false) {
      signInWithEmailAndPassword(
        auth,
        this.state.userEmail,
        this.state.userPassword
      ).then((userInfo) => {
        // Will be signed in, and return the userInfo branch from Firebase Auth.
        // Q: What does this "signed-in" mean? Is there a second channel connecting to Firebase Auth that becomes active when Signed In?
        const user = userInfo.user;

        this.setState({
          currentUID: user.uid,
          isSignedIn: true,
          userPassword: "",
        });
      });
    }
  };

  scrollToBottom = () => {
    if (this.chatWindow.current) {
      const lastMsg = this.chatWindow.current.lastChild;
      if (lastMsg) {
        lastMsg.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  render() {
    // Convert messages in state to message JSX elements to render
    // note that message.val  is defined by data.val() which is a firebase method. then whatever extra keys i add into the value will be an additional key
    // i.e. message.val.text
    let messageListItems = this.state.messages.map((message) => (
      <>
        <div
          key={message.key}
          className="bg-slate-50 rounded-[4rem] rounded-bl-none lg:rounded-full lg:rounded-bl-none m-2 p-3 "
        >
          <div className="p-2 pl-10 pr-10 rounded-[4rem] rounded-bl-none lg:rounded-full lg:rounded-bl-none border-dashed border-slate-600 border-2">
            <h3 className="text-2xl chatbubbletext text-slate-700 p-3 text-left leading-tight lg:max-w-xl">
              {message.val.text}
            </h3>

            <p className="text-md chatbubbletext text-slate-800 pr-3 pl-3 leading-tight">
              {message.val.userEmail === ""
                ? message.val.userEmail
                : "Anonymous"}
            </p>

            <p className="text-sm chatbubbletext text-slate-400 pr-3 pl-3 leading-tight">
              {message.val.timestamp}
            </p>

            <p>{message.val.likes}</p>

            <input
              type="button"
              id={message.key}
              value="Like"
              className="text-sm chatbubbletext bg-red-500 rounded-md shadow-sm pr-2 pl-2 mb-2 mt-2 ml-3"
              onClick={this.handleIncrementLike}
            />

            {this.state.currentUID === message.val.userUID ? (
              <input
                type="button"
                id={message.key}
                value="Delete"
                className="text-sm chatbubbletext bg-slate-300 rounded-md shadow-sm pr-2 pl-2 mb-2 mt-2 ml-3"
                onClick={this.handleDelete}
              />
            ) : null}

            {message.val.fileURL !== "photoURL" ? (
              <img
                src={message.val.fileURL}
                alt=""
                className="w-[2rem] h-[2rem] object-cover rounded-[50%] border-slate-400 border-[1px] border-solid overflow-hidden"
              />
            ) : (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/rocketgram-ftbc13.appspot.com/o/images%2Fdefaultpic.png?alt=media&token=5ca175aa-98c8-4a4a-8966-8f85160575a7&_gl=1*154w6kf*_ga*OTA4NjcyODY0LjE2OTU1NDU0NjI.*_ga_CW55HF8NVT*MTY5NTg3OTY5MC4yMS4xLjE2OTU4ODQwMTEuMy4wLjA."
                alt="default"
                className="w-[2rem] h-[2rem] object-cover rounded-[50%] border-slate-400 border-[1px] border-solid overflow-hidden"
              />
            )}
          </div>
        </div>
      </>
    ));

    return (
      <>
        <div className="sticky bg-violet-200 overflow-hidden text-center p-0">
          <div className="text-[2rem] chatbubbletext">~ COZY CHAT CORNER ~</div>

          {this.state.isSignedIn === true ? null : (
            <>
              <div class="collapse bg-base-200">
                <input type="checkbox" />
                <div class="collapse-title text-xl font-medium">
                  Sign In For Additional Access{" "}
                </div>

                {/* SIGN IN FORMS */}
                <div class="collapse-content">
                  <input
                    type="text"
                    name="userEmail"
                    value={this.state.userEmail}
                    onChange={this.handleTextChange}
                    autoComplete="off"
                    placeholder="Email"
                    className="input input-bordered input-warning min-w-[20vw] text-slate-800 mr-5"
                  />
                  <br />
                  <input
                    type="text"
                    name="userPassword"
                    value={this.state.userPassword}
                    onChange={this.handleTextChange}
                    autoComplete="off"
                    placeholder="Password"
                    className="input input-bordered input-warning min-w-[20vw] text-slate-800 mr-5"
                  />
                  <br />
                  <input
                    type="button"
                    onClick={this.loginSubmit}
                    className="btn btn-neutral btn-sm"
                    value="Create Account"
                  />

                  <input
                    type="button"
                    onClick={this.loginSubmitExisting}
                    className="btn btn-neutral btn-sm"
                    value="Sign In"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* MESSAGES DISPLAY HERE */}
        <div
          ref={this.chatWindow}
          className="flex flex-col items-start justify-start h-screen chatbackground pt-5 pb-60 pr-5 pl-5 overflow-y-auto max-h-[90vh] chat-container"
        >
          {messageListItems}
        </div>

        {/* TEXT INTERFACE */}
        <div className="flex flex-row justify-center gap-5 pt-5 pb-5 absolute bottom-0 bg-indigo-200 min-w-full">
          <form onSubmit={this.writeData} className="join">
            <input
              type="text"
              name="messageText"
              value={this.state.messageText}
              onChange={this.handleTextChange}
              autoComplete="off"
              placeholder="Input your message here"
              className="input input-secondary min-w-[50vw]| text-slate-800 join-item"
            />

            <input
              type="button"
              onClick={this.writeData}
              className="btn btn-secondary max-w-xs join-item rounded-r-xl"
              value="Send"
            />
          </form>
          <form>
            <input
              type="file"
              name="fileUpload"
              value={this.state.fileInputValue}
              onChange={(ev) => {
                this.setState({
                  fileInputFile: ev.target.files[0],
                  fileInputValue: ev.target.fileUpload,
                });
              }}
              className="file-input file-input-bordered file w-full max-w-xs"
            />
          </form>
        </div>
      </>
    );
  }
}

export default App;
