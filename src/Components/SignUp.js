import { useState } from "react";

const SignUpForm = (props) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id } = e.target;
    if (id === "signup") {
      props.handleSignUp(emailInput, passwordInput);
    } else if (id === "login") {
      props.handleLogIn(emailInput, passwordInput);
    }
  };

  return (
    <form className="login">
      <input
        id="emailInput"
        type="email"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        placeholder="Enter email here"
      ></input>
      <input
        id="passwordInput"
        type="password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        placeholder="Enter password"
      ></input>
      <button id="signup" onClick={handleSubmit}>
        Sign Up
      </button>
      <button id="login" onClick={handleSubmit}>
        Login
      </button>
    </form>
  );
};

export default SignUpForm;
