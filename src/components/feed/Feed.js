//-----------Imports-----------//
import React from "react";
//-----------Components-----------//

//-----------Firebase-----------//
import {
  onChildAdded,
  onChildRemoved,
  push,
  ref,
  remove,
} from "firebase/database";

import { uploadBytes, ref as sRef, getDownloadURL } from "firebase/storage";

import { database, storage } from "../../firebase/firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messageList";

export default class FeedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      likes: 0,
      messageList: [],
      file: null,
    };
  }
  // Update feed/chat on changes
  componentDidMount() {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messageList: [...state.messageList, { key: data.key, ...data.val() }],
      }));
    });
    onChildRemoved(messagesRef, (data) => {
      console.log("child removed:", data.val());
      const newMessageList = this.state.messageList.filter(
        (message) => message.key !== data.key,
      );
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState({
        messageList: newMessageList,
      });
    });
  }

  writeData = () => {
    //Push image into database
    const fileRef = sRef(storage, `image/${this.state.file.name}`);
    uploadBytes(fileRef, this.state.file)
      .then(() => {
        return getDownloadURL(fileRef);
      })
      .then((url) => {
        console.log(url);
        //Add messages and final url AFTER images url generated
        const messageListRef = ref(database, DB_MESSAGES_KEY);
        push(messageListRef, {
          message: this.state.message,
          date: `${new Date()}`,
          image: url,
        });
      })
      // Clear input fields
      .then(() => {
        this.setState({ message: "", file: null });
      });
  };

  fileChange = (e) => {
    console.log(e.target.files); //---------------------TEST OBJECT HERE why need [0]
    this.setState({ file: e.target.files[0] });
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
    const { message, file } = this.state;
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messageList.map((message) => (
      <li
        className="chat-bubble m-2 flex w-full flex-col justify-between"
        key={message.key}
      >
        <section className="flex flex-row justify-between">
          <p>{message.message}</p>
          <div>
            <img src={message.image} alt="nice" />
          </div>
          <button
            className="m-0 text-xs text-slate-500 hover:text-slate-200"
            id={message.key}
            onClick={(e) => this.handleDelete(e)}
          >
            delete
          </button>
        </section>

        <p className="ml-auto text-[10px]">{this.formatTime(message.date)}</p>
      </li>
    ));

    return (
      <div className="flex h-screen w-screen flex-col  ">
        <header className="flex flex-grow flex-col items-center justify-center bg-red-100">
          <div className=" flex max-h-[75vh] w-1/2 flex-grow flex-col-reverse overflow-y-auto">
            <ol className="chat-end m-1">{messageListItems}</ol>
          </div>
          <section className="m-4 flex w-full flex-row justify-center">
            <form onSubmit={this.writeData} className="mr-2 w-3/4">
              <input
                type="file"
                className="input input-bordered w-full "
                id="file"
                placeholder="What are you doing now?"
                onChange={this.fileChange}
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
