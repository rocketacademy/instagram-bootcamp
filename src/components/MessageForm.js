import React, { useState } from 'react';

export const MessageForm = ({ writeData }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { value } = e.target; // Destructure the value from e.target
    setMessage(value); // Update the message state with the value
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    writeData(message); // Pass the message to the writeData function
    setMessage(''); // Reset the message state
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          value={message}
          onChange={handleChange}
        />
        <button type="submit">send message</button>
      </form>
    </>
  );
};
