import React, { useState } from "react";

const LikeHook = (props) => {
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState(0);

  return (
    <div>
      <h1>{props.name ? props.name : "Stranger"}'s Counter</h1>
      <h2>Current Count: {count}</h2>
      <h2>Current Clicked: {clicked}</h2>
      <button
        onClick={() => {
          setCount(count + 1);
          setClicked(clicked + 1);
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          setCount(count - 1);
          setClicked(clicked + 1);
        }}
      >
        -
      </button>
    </div>
  );
};

export default LikeHook;
