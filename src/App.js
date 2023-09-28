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
      console.log("hello", snapshot.val().likes);
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

    // onValue(childToIncrementLike, (snapshot) => {
    //   const data = snapshot.val();
    //   return data;
    // }).then((data) => {
    //   console.log(data);
    //   set(childToIncrementLike, {
    //     text: data.text,
    //     timestamp: data.timestamp,
    //     fileURL: data.fileURL,
    //     likes: data.likes + 1,
    //   });
    // });

    // get(childToIncrementLike).then((snapshot) => {
    //   console.log(snapshot.val().likes);
    // });

    // console.log(childToIncrementLike);
    // const existingLikes = childToIncrementLike
  };

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (fileUrl) => {
    // ev.preventDefault();

    if (this.state.messageText !== "") {
      const messageListRef = ref(realTimeDatabase, DB_MESSAGES_KEY);
      const newMessageRef = push(messageListRef); // Sets a key - assigned by Firebase - for a NEW branch in Firebase
      // Need to seperate per user, give it an ID and create a new item in the list
      set(newMessageRef, {
        text: this.state.messageText,
        timestamp: new Date().toTimeString(),
        fileURL: this.state.fileURL,
        likes: this.state.likes,
        comments: this.state.comments,
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
    const fullStorageRef = sRef(
      storage,
      STORAGE_KEY + this.state.fileInputFile.name
    );

    console.log("ok");
    uploadBytes(fullStorageRef, this.state.fileInputFile).then((snapshot) => {
      getDownloadURL(fullStorageRef, this.state.fileInputFile.name).then(
        (fileUrl) => this.writeData(fileUrl)
      );
    });
  };

  displayedLikes = (childinstance) => {
    // console.log("displayed");
    onValue(
      ref(realTimeDatabase, `${DB_MESSAGES_KEY}/${childinstance}`),
      (snapshot) => {
        let newLikes = snapshot.val().likes;
        // console.log(snapshot.val);
        return newLikes;
      }
    );
  };

  // displayedLikes = (childinstance) => {
  //   get(ref(realTimeDatabase, `${DB_MESSAGES_KEY}/${childinstance}`)).then(
  //     (snapshot) => {
  //       // console.log("hey");
  //       // console.log(snapshot);
  //       // console.log(snapshot.val().likes);
  //       console.log("triggered");
  //       return snapshot.val().likes;
  //     }
  //   );
  // };

  scrollToBottom = () => {
    if (this.chatWindow.current) {
      const lastMsg = this.chatWindow.current.lastChild;
      if (lastMsg) {
        lastMsg.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // //  THIS WORKS, But doesnt have the smooth behaviour
  // scrollToBottom = () => {
  //   if (this.chatWindow.current) {
  //     this.chatWindow.current.scrollTop = this.chatWindow.current.scrollHeight;
  //   }
  // };

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
            <p className="text-md chatbubbletext text-slate-400 pr-3 pl-3 leading-tight">
              {message.val.timestamp}
            </p>
            <p>{message.val.likes}</p>

            {/* <p>{this.displayedLikes(message.key)}</p> */}
            {/* 
            <p>
              {onValue(
                ref(realTimeDatabase, `${DB_MESSAGES_KEY}/${message.key}`),
                (snapshot) => (
                  <p>snapshot.val().likes</p>
                )
              )}
            </p> */}

            <input
              type="button"
              id={message.key}
              value="Delete"
              className="text-sm chatbubbletext bg-slate-300 rounded-md shadow-sm pr-2 pl-2 mb-2 mt-2 ml-3"
              onClick={this.handleDelete}
            />
            <input
              type="button"
              id={message.key}
              value="Like"
              className="text-sm chatbubbletext bg-red-500 rounded-md shadow-sm pr-2 pl-2 mb-2 mt-2 ml-3"
              onClick={this.handleIncrementLike}
            />
            <div>
              {message.val.fileURL ? (
                <img src={message.val.fileURL} alt="" />
              ) : (
                <p>"no image provided"</p>
              )}
            </div>
          </div>
        </div>
      </>
    ));

    return (
      <>
        <div className="sticky bg-violet-200 overflow-hidden text-center p-0">
          <div className="text-[2rem] chatbubbletext">~ COZY CHAT CORNER ~</div>
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
          <form onSubmit={this.writeData}>
            <input
              type="text"
              name="messageText"
              value={this.state.messageText}
              onChange={this.handleTextChange}
              // onSubmit={this.handleSubmitEnter}
              autoComplete="off"
              placeholder="Input your message here"
              className="input input-bordered input-warning min-w-[50vw] text-slate-800 mr-5"
            />

            <input
              type="button"
              onClick={this.writeData}
              // onClick={this.writeData}
              className="btn btn-secondary max-w-xs"
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
