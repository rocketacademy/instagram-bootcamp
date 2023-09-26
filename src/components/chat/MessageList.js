import React from "react";
//-----------Components-----------//
import Message from "./Message";

//-----------Firebase-----------//
import {
  onChildAdded,
  onChildRemoved,
  push,
  ref,
  set,
  remove,
} from "firebase/database";
import { database } from "../../firebase/firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messageList";

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messageList: [],
    };
  }

  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      console.log("child added:", data.val());
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messageList: [...state.messageList, { key: data.key, val: data.val() }],
      }));
    });
    onChildRemoved(messagesRef, (data) => {
      console.log("child removed:", data.val());
      const newMessageList = this.state.messageList.filter(
        (message) => message.key !== data.key,
      );
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState({
        // Store message key so we can use it as a key in our list items when rendering messages
        messageList: newMessageList,
      });
    });
  }

  writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    push(messageListRef, {
      message: this.state.message,
      date: `${new Date()}`,
    });
    // Clear input fields
    this.setState({ message: "" });
  };

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  };

  handleDelete = (e) => {
    const messagesRef = ref(database, `${DB_MESSAGES_KEY}/${e.target.id}`);
    remove(messagesRef);
  };

  formatTime = (timestamp) => {
    const formatted = new Date(timestamp).toLocaleTimeString("en-GB", {
      hour12: true,
      hour: "numeric", // '2-digit' or 'numeric'
      minute: "2-digit", // 'numeric'
      year: "2-digit", // '2-digit' or 'numeric'
      month: "short", // 'short', 'narrow' or 'long'
      day: "2-digit", // '2-digit' or 'numeric'
    });
    return formatted;
  };

  render() {
    const { message } = this.state;
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messageList.map((message) => (
      <li
        className="chat-bubble m-2 flex w-full flex-col justify-between"
        key={message.key}
      >
        <section className="flex flex-row justify-between">
          <p>{message.val.message}</p>
          <div></div>
          <button
            className="m-0 text-xs text-slate-500 hover:text-slate-200"
            id={message.key}
            onClick={(e) => this.handleDelete(e)}
          >
            delete
          </button>
        </section>

        <p className="ml-auto text-[10px]">
          {this.formatTime(message.val.date)}
        </p>
      </li>
    ));

    return (
      <div className="flex h-screen flex-col  ">
        <header className="flex flex-grow flex-col items-center justify-center bg-red-100">
          <div className=" flex max-h-[70vh] w-1/2 flex-grow flex-col-reverse overflow-y-auto">
            <ol className="chat-end m-1">{messageListItems}</ol>
          </div>
          <section className="m-4 flex w-full flex-row justify-center">
            <form onSubmit={this.writeData} className="mr-2 w-3/4">
              <input
                type="text"
                className="input input-bordered w-full "
                id="message"
                value={message}
                placeholder="What are you doing now?"
                onChange={this.handleChange}
              ></input>
            </form>
            <button className="btn" onClick={this.writeData}>
              Send
            </button>
          </section>
        </header>
      </div>
    );
  }
}
