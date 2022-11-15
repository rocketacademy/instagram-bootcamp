import {format } from 'date-fns';
import {
  onValue,
  ref,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import { database } from "../firebase";

export function ChatList() {
  const [messages,setMessages] = useState([]);

  useEffect(() => {

    const messagesRef = ref(database, "messages");
    onValue(messagesRef, (snapshot) => {
      const newMessages = [];
      snapshot.forEach((childSnapshot) => {
        newMessages.push(childSnapshot.val());

      });
      setMessages(newMessages);
    });
  },[]);

  return (
    <div className="w-90" style={{ border: "2px solid white", width: "90%" }}>
      <h3>Chat List</h3>
      {messages.map((message, index) => (
        <div key={index} style={{ border: "2px solid white" }}>
          <p style={{ fontSize: "12px" }}>
            {message.name} @ &nbsp;
            {/* {new Date(message.timestamp).getDate()}/
            {new Date(message.timestamp).getMonth() + 1}/
            {new Date(message.timestamp).getFullYear()},{" "}
            {new Date(message.timestamp).getHours()}
            {new Date(message.timestamp).getMinutes()} hrs */}
            {format(new Date(message.timestamp), "PPpp")}
          </p>
          <p style={{ fontSize: "12px" }}>{message.chat}</p>
        </div>
      ))}
    </div>
  );
}
