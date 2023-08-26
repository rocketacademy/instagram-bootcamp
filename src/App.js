import React, {useState,useEffect} from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database } from "./firebase";
import logo from "./logo.png";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

function App () {
  const [state,setState]=useState({
    messages:null,
  })
  // Note use of array fields syntax to avoid having to manually bind this method to the class
  const writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, "abc");
  };

    useEffect(()=>{
      const messagesRef = ref(database, DB_MESSAGES_KEY);
      // onChildAdded will return data for every child at the reference and every subsequent new child
    
      onChildAdded(messagesRef, (data) => {
        // Add the subsequent child to local component state, initialising a new array to trigger re-render
        setState((state) => ({
          // Store message key so we can use it as a key in our list items when rendering messages
          messages: [...state.messages, { key: data.key, val: data.val() }],
        }));
      });
    },[])

    // Convert messages in state to message JSX elements to render
    // The error is here!
    let messageListItems = state.messages.map((message) => (
      <li key={message.key}>{message.val}</li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Rocketgram Chat App
          </p>
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <button onClick={()=>writeData}>Send</button>
          <ol>{messageListItems}</ol>
        </header>
      </div>
    );
}

export default App;
