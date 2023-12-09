import { push, ref, set } from "firebase/database";
import { database } from "../firebase";
import { useState } from "react";

export const MessageFormFunction = () => {
  const DB_MESSAGES_KEY = "messages";

  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      messageString: inputValue,
      date: new Date().toLocaleString(),
    });
    setInputValue("");
  };

  return (
    <form className="flex w-full mr-5" onSubmit={writeData}>
      <input
        className="w-full mr-2 ml-5 input input-bordered text-slate-900"
        type="text"
        placeholder="Type here"
        value={inputValue}
        onChange={handleChange}
      />
      <div className="btn" onClick={writeData}>
        Send
      </div>
    </form>
  );
};
