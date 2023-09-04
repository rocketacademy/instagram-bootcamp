import React, {useState,useEffect} from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import {ref as storageRef, uploadBytes, getDownloadURL} from 'firebase/storage'
import { database, storage } from "./firebase";
import logo from "./logo.png";
import "./App.css";
import ChatRoom from "./Component/ChatRoom";
import InputForm from "./Component/InputForm";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "post/images"

function App () {
  // const [state,setState]=useState({
  //   messages:[],
  //   name: "",
  //   messageToSend:"",
  // })
  // // Note use of array fields syntax to avoid having to manually bind this method to the class
  // const writeData = () => {
  //   const messageListRef = ref(database, DB_MESSAGES_KEY);
  //   const newMessageRef = push(messageListRef);
  //   set(newMessageRef, {
  //     username:state.name,
  //     messageBody:state.messageToSend,
  //     date: new Date().toLocaleString(),
  //   });
  // };

  // const handleSubmit = (event) =>{
  //   event.preventDefault(event);
  //   writeData();
  // }
  
  // const handleChange =(e) =>{
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   setState({...state,
  //     [name]:value,
  //   })
  //   console.log(state)
  // }
  //key in username
  //check db if there is such user
  //if there is user, load existing messages and display. else create user with empty messages list
  //but how to include messages with other users? timestamp?
  //display [timestamp] user: message
  //for user in session, display with different color bg or left right orientation

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Rocketgram Chat App
        </h1>

        <InputForm/>
        <ChatRoom/>
      </header>
    </div>
  );
}

export default App;
