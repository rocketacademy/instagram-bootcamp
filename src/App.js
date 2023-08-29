import React, { useState, useEffect } from 'react';
import { onChildAdded, push, ref, set } from 'firebase/database';
import { database } from './firebase';
import logo from './logo.png';
import './App.css';
import { MessageForm } from './components/MessageForm';

const DB_MESSAGES_KEY = 'messages';

export const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    const handleChildAdded = (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    };

    onChildAdded(messagesRef, handleChildAdded);

    return () => {
      // Cleanup function to unsubscribe from Firebase listener
      onChildAdded(messagesRef, handleChildAdded);
    };
  }, []);

  const writeData = (message) => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, message);
  };

  let messageListItems = messages.map((message) => (
    <li key={message.key}>{message.val}</li>
  ));

  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <MessageForm writeData={writeData} />
          <ol>{messageListItems}</ol>
        </header>
      </div>
    </>
  );
};
