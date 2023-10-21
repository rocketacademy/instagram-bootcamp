import React from 'react';
import { useContext } from 'react';
import { toggleContext } from './toggleContext';

const CloseButton = () => {
  const toggleForm = useContext(toggleContext);

  return (
    <svg
      className="close_form"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      onClick={toggleForm}
      style={{ cursor: 'pointer' }}
    >
      <path
        fill="#000000"
        d="M19.3 4.7c-0.4-0.4-1-0.4-1.4 0l-6.6 6.6-6.6-6.6c-0.4-0.4-1-0.4-1.4 0s-0.4 1 0 1.4l6.6 6.6-6.6 6.6c-0.4 0.4-0.4 1 0 1.4 0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3l6.6-6.6 6.6 6.6c0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.4-0.4 0.4-1 0-1.4l-6.6-6.6 6.6-6.6c0.4-0.4 0.4-1 0-1.4z"
      />
    </svg>
  );
};

export default CloseButton;
