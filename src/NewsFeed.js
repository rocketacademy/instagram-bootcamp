import React, { useEffect, useState } from "react";
import { database } from "./firebase";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import Card from "react-bootstrap/Card";
import CreatePost from "./CreatePost";

const MESSAGE_FOLDER_NAME = "messages";

const NewsFeed = ({ userEmail }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = databaseRef(database, MESSAGE_FOLDER_NAME);

    onChildAdded(messagesRef, (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  return (
    <div>
      {userEmail === "Guest" ? (
        <p>Sign in to start posting</p>
      ) : (
        <CreatePost currentUser={userEmail} />
      )}
      {messages.map((message) => (
        <Card
          className="post-cards"
          key={message.key}
          style={{ width: "30vw" }}
        >
          <Card.Img variant="top" src={message.val.imageURL} />
          <Card.Body>
            <Card.Text>
              {message.val.user}:{message.val.userMessage}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            {new Date(message.val.date).toLocaleString()}{" "}
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
};

export default NewsFeed;
