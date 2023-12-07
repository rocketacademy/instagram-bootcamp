import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "../firebase.js";
import { useState, useEffect } from "react";
import "../App.css";

const DB_MESSAGES_KEY = "messages";

const Textfield = (props) => {
  const [inputField, setInputField] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let loadedMessages = [];
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    const unsubscribe = onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      loadedMessages = [...loadedMessages, { key: data.key, val: data.val() }];
      setMessages(loadedMessages);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleChange = (e, setter) => {
    setter(e.target.value);
  };

  const writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    let newDate = new Date() - 0;
    // newDate = newDate - newDate.getTimezoneOffset() * 60000;
    set(newMessageRef, {
      text: inputField,
      date: newDate,
      name: props.name,
    });
    setInputField("");
  };

  let messageListItems = messages.map((message) => (
    <div
      style={{
        textAlign: props.name === message.val.name ? "right" : "left",
      }}
      key={message.key}
    >
      <p className="msg-name">
        {props.name === message.val.name ? "You" : message.val.name}
      </p>
      <div className="msg-bubble">
        {message.val.text}
        <br />
        <span className="msg-date-time">
          {new Date(message.val.date).toLocaleTimeString()},
          {new Date(message.val.date).toLocaleDateString()}
        </span>
      </div>
    </div>
  ));

  return (
    <header className="App-header row">
      <h4>
        {props.name === ""
          ? "Please insert your name before chatting."
          : `Currently logged in as: ${props.name}`}
      </h4>
      <div className="msg-container col-lg-8 col-sm-12">
        {props.name === "" ? null : messageListItems}
      </div>

      {props.name !== "" && (
        <div>
          <input
            className="col-lg-8 col-sm-12"
            type="text"
            value={inputField}
            onChange={(e) => handleChange(e, setInputField)}
          />
          <button className="col-lg-8 col-sm-12" onClick={writeData}>
            Send
          </button>
        </div>
      )}
    </header>
  );
};

export default Textfield;
