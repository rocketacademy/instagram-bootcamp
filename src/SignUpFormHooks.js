import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const SignUpFormHooks = () => {
  const [state, setState] = useState({ emailInput: "", passwordInput: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(
      auth,
      state.emailInput,
      state.passwordInput
    ).then(() => {
      setState({ emailInput: "", passwordInput: "" });
    });
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.id]: e.target.value });
    console.log(state);
  };

  // handleSignup = (email, password) => {
  //   createUserWithEmailAndPassword(auth, email, password);
  // };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={state.emailInput}
          id="emailInput"
          type="email"
          placeholder="enter your email here"
          onChange={handleChange}
        ></input>
        <input
          value={state.passwordInput}
          id="passwordInput"
          type="password"
          placeholder="give me your password"
          onChange={handleChange}
        ></input>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpFormHooks;
