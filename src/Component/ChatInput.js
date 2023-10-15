// ChatInput.js
import React from "react";

const ChatInput = ({ newMessage, onInputChange, onSubmit, isInputEnabled }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={newMessage}
        onChange={onInputChange}
        placeholder="Enter a message"
        disabled={!isInputEnabled}
      />
      <button type="submit" disabled={!isInputEnabled}>
        Send
      </button>
      <br />
    </form>
  );
};

export default ChatInput;
