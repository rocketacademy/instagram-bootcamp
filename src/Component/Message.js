// Message.js
import React from "react";

const Message = ({ message, user, onDelete, onEdit }) => {
  return (
    <div
      className={`message ${
        message.user === user.uid ? "outgoing" : "incoming"
      }`}
    >
      <div className="message-content">
        <div className="message-buttons">
          <button
            className="edit-button"
            onClick={() => onEdit(message.key, message.message)}
          >
            ✏️
          </button>
          <button
            className="delete-button"
            onClick={() => onDelete(message.key)}
          >
            ❌
          </button>
        </div>
        <div className="message-text">{message.message}</div>
        <div className="message-metadata">
          {message.datetime} &nbsp;
          {message.user === user.uid
            ? user.nickname || user.email
            : "Other User"}
        </div>
      </div>
    </div>
  );
};

export default Message;
