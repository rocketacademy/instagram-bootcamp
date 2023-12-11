import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "../../firebase";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const DB_MESSAGES_KEY = "messages";

const Chat = () => {
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  const handleChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    writeData();
  };

  const writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      textInput: textInput,
      date: new Date().toLocaleString(),
    });
  };

  const goToFeed = () => {
    navigate("/feed");
  };

  console.log("Rendering Chat");
  let messageListItems = messages.map((message) => (
    <li key={message.key}>
      {message.val.textInput} - {message.val.date}
    </li>
  ));

  return (
    <div className="app-header">
      <form>
        <input
          type="text"
          value={textInput}
          placeholder="Send a message!"
          onChange={handleChange}
        ></input>
        <button onClick={handleSubmit}>Send</button>
        <button onClick={goToFeed}>Go to Feed</button>
      </form>
      <ol>{messageListItems}</ol>
    </div>
  );
};

export default Chat;
