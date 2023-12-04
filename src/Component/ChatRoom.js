import React, {useState,useEffect} from "react";
import { onChildAdded, ref } from "firebase/database";
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


  return(
    <div style={{display:"flex",backgroundColor:"Azure",justifyContent:"space-between",width:"70vw"}}>
      <ul style={{listStyleType:"none",width:"95%"}}>
        {messages.length>0?(messages.map((message) => (
          <>
            <li key={message.key} style={{display:"flex",marginRight:"35px",backgroundColor:"MidnightBlue",borderRadius:"20px",marginBottom:"10px"}}>
              <div style={{margin:"0px 10px"}}>
                <p style={{fontSize:"15px",alignContent:"flex-start"}}>
                  [{message.val.date}] </p> 
                  <p style={{fontSize:"24px"}}>{message.val.username}: {message.val.messageBody}  </p>
              </div>
            </li>
          </>
        ))):<p>There are no messages now!</p>}
      </ul>
    </div>
  )
}

export default ChatRoom;