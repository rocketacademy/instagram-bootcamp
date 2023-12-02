import React from "react";
import { onChildAdded, ref } from "firebase/database";
import { database } from "./firebase";
import "./App.css";
import FileUploadForm from "./Components/FileUploadForm";
import MessageForm from "./Components/MessageForm";
import PostDisplay from "./Components/PostDisplay";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message, index) => (
      <li
        key={message.key}
        className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"}`} //alternate between chat start and chat end
      >
        <div className="chat-footer text-xs opacity-50">{message.val.date}</div>
        <div className="chat-bubble text-left break-all">
          {message.val.messageString}
        </div>
        <div>
          <img src={message.val.url} alt={message.val.name} />
        </div>
      </li>
    ));
    return (
      <div className="h-screen flex flex-col items-center justify-end pb-10 lg:flex-row lg:justify-around">
        <div className="">
          <div className="mb-10">
            <ol className="">{messageListItems}</ol>
          </div>
          <div className="flex lg:justify-between m-2 mb-10">
            <MessageForm />
          </div>
        </div>
        <div>
          <p className="text-lg text-center font-semibold"> Album Highlights</p>
          <PostDisplay />
          <FileUploadForm />
        </div>
      </div>
    );
  }
}

export default App;
