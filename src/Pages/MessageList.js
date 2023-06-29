import { useState, useEffect } from "react";
import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

export default function MessageList() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);

    onChildAdded(messagesRef, (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  return (
    <div>
      <ol>
        {messages && messages.length > 0 ? (
          messages.map((messageItem) => (
            <li key={messageItem.key}>
              <div>
                <h4>
                  {messageItem.val.date} - {messageItem.val.userID}
                </h4>
                <p>{messageItem.val.message}</p>
              </div>
            </li>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </ol>
    </div>
  );
}
