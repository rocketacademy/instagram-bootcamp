import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import Header from "../components/header-Hooks.js";
import Footer from "../components/footer-Hooks.js";

import { onChildAdded, onChildRemoved, push, ref } from "firebase/database";

import { database } from "../firebase.js";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

const Messenger = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const onChange = (e) => {
    let { id, value } = e.target;

    if (id === "inputMessage") {
      setInputMessage(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Message submit
    let dbRef = ref(database, DB_MESSAGES_KEY);
    push(dbRef, {
      inputMessage: inputMessage,
      date: `${new Date()}`,
    });

    //Clear message
    setInputMessage("");
  };

  const formatTime = (time) => {
    const formattedTime = new Date(time).toLocaleTimeString("en-US", {
      hour12: true,
      weekday: "short", // "long" or "short" or "narrow"
      hour: "numeric", // '2-digit' or 'numeric'
      minute: "2-digit", // 'numeric'
      //year: "2-digit", // '2-digit' or 'numeric'
      month: "short", // 'short', 'narrow' or 'long'
      day: "2-digit", // '2-digit' or 'numeric'
    });
    return formattedTime;
  };

  //Replace "componentDidMount()"
  useEffect(() => {
    const dbRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(dbRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      setMessages(messages => {
        return [
          ...messages, 
          { key: data.key, ...data.val() }
        ]
      });
    });
  }, []);

  const messageListItems = () => {
    return messages.map((message) => {
      return (
        <div key={message.key} className="chat chat-end">
          <div className="chat-header">
            <time className="text-xs opacity-50">
              {formatTime(message.date)}
            </time>
          </div>
          <div className="chat-bubble text-right text-sm">
            {message.inputMessage}
          </div>
          <i className="fi fi-rr-paper-plane"></i>
        </div>
      );
    });
  };

  return (
    <div className="App">
      <Header />
      <section
        className="absolute bottom-32 flex h-screen w-screen flex-col p-4 overflow-auto scroll-auto"
        style={{ height: "calc(100% - 208px)" }}
      >
        <div className="flex flex-col items-end justify-center">
          {messageListItems()}
        </div>
      </section>

      <form
        onSubmit={(e) => handleSubmit(e)}
        className="absolute bottom-16 flex items-center justify-between w-screen p-4 gap-2"
      >
        <input
          type="text"
          id="inputMessage"
          placeholder="Input your text here"
          onChange={(e) => onChange(e)}
          value={inputMessage}
          className="input input-bordered w-full p-2 rounded"
        />
        <input className="btn" type="submit" />
      </form>
      <Footer />
    </div>
  );
};

export default Messenger