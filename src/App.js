import React from "react";
import {
  onChildAdded,
  push,
  ref,
  set,
  onChildRemoved,
  remove,
} from "firebase/database";
import { realTimeDatabase } from "./firebase/firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "storedMessages"; //This corresponds to the Firebase branch

class App extends React.Component {
  constructor(props) {
    super(props);

    this.chatWindow = React.createRef();

    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messageText: "",
      messages: [],
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
  }

  handleTextChange = (ev) => {
    let { name, value } = ev.target;
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

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = (ev) => {
    ev.preventDefault();

    if (this.state.messageText !== "") {
      const messageListRef = ref(realTimeDatabase, DB_MESSAGES_KEY);
      const newMessageRef = push(messageListRef);
      // Need to seperate per user, give it an ID and create a new item in the list
      set(newMessageRef, {
        text: this.state.messageText,
        timestamp: new Date().toTimeString(),
      });

      // console.log(this.state.messages);
      console.log("triggering scroll");
      this.scrollToBottom();
    } else {
      console.log("failed");
    }

    // Reset Input Field Value
    this.setState({
      messageText: "",
    });
  };

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

            <input
              type="button"
              id={message.key}
              value="Delete"
              className="text-sm chatbubbletext bg-slate-300 rounded-md shadow-sm pr-2 pl-2 mb-2 mt-2 ml-3"
              onClick={this.handleDelete}
            />
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
              className="btn btn-outline btn-secondary max-w-xs"
              value="Send"
            />
          </form>
        </div>
      </>
    );
  }
}

export default App;
