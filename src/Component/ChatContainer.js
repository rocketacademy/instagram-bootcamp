// ChatContainer.js
import React from "react";
import Message from "./Message";

const ChatContainer = ({ messages, user, onDeleteMessage, onEditMessage }) => {
  return (
    <div className="chat-container">
      {messages.map((message) => (
        <Message
          key={message.key}
          message={message}
          user={user}
          onDelete={onDeleteMessage}
          onEdit={onEditMessage}
        />
      ))}
    </div>
  );
};

export default ChatContainer;
