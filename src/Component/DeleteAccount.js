// DeleteAccount.js
import React, { useState } from "react";

const DeleteAccount = ({ onDeleteAccount }) => {
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const handleDelete = () => {
    onDeleteAccount();
  };

  return (
    <div>
      {isConfirmationVisible ? (
        <div>
          Are you sure you want to delete your account?
          <button onClick={handleDelete}>Yes</button>
          <button onClick={() => setIsConfirmationVisible(false)}>No</button>
        </div>
      ) : (
        <button onClick={() => setIsConfirmationVisible(true)}>
          Delete Account
        </button>
      )}
    </div>
  );
};

export default DeleteAccount;
