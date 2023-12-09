import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";
import { useEffect, useState } from "react";

export const ChatMessagesFunction = () => {
  // Save the Firebase message folder name as a constant to avoid bugs due to misspelling
  const DB_MESSAGES_KEY = "messages";
  const [messages, setMessages] = useState([]);
  const messagesRef = ref(database, DB_MESSAGES_KEY);

  useEffect(() => {
    onChildAdded(messagesRef, (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  // Convert messages in state to message JSX elements to render
  let messageListItems = messages.map((message, index) => (
    <li
      key={message.key}
      className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"}`} //alternate between chat start and chat end
    >
      <div className="chat-footer text-xs opacity-50">{message.val.date}</div>
      <div className="chat-bubble text-left break-all">
        {message.val.messageString}
      </div>
    </li>
  ));

  return <div className="m-5 overflow-auto">{messageListItems}</div>;
};
