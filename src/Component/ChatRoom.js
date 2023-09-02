import React, {useState,useEffect} from "react";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "../firebase";

const DB_MESSAGES_KEY = "messages";

const ChatRoom=()=>{
  const [messages,setMessages] = useState([]);
  
  const getMessages = async() =>{
    const handleData = (data) => {
      setMessages((prevMessages)=>
        // console.log(prevMessages)
        [
        ...prevMessages, { key: data.key, val: data.val() },
      ]
    )};
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    //onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, handleData
      // (data) => {
      // setMessages({
      //   messages: [...messages,{ key: data.key, val: data.val() }],
      // })}
    )
    console.log("getMessages was ran")
    console.log()
  };

  useEffect(()=>{
    getMessages();
    console.log("use effect was run")
  },[]);

  useEffect(()=>{
      console.log(messages)
  },[messages])


  return(
    <div style={{backgroundColor:"Azure",color:"Black"}}>
      <ul style={{listStyleType:"none"}}>
        {messages.length>0?(messages.map((message) => (
          <>
            <li key={message.key}>
              <div>
                <h4>
                  [{message.val.date}]{message.val.username}:{message.val.messageBody}  
                </h4>
              </div>
            </li>
          </>
        ))):<p>There are no messages now!</p>}
      </ul>
    </div>
  )
}

export default ChatRoom;