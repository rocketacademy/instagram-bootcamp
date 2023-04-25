import { useState } from "react";

const SignUpForm = ({ handleSignUp, handleLogIn }) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id } = e.target;
    if (id === "signup") {
      handleSignUp(emailInput, passwordInput);
    } else if (id === "login") {
      handleLogIn(emailInput, passwordInput);
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
      />
      <input
        id="passwordInput"
        type="password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        placeholder="Enter password"
      />
      <button id="login" onClick={handleSubmit}>
        Login
      </button>
      <button id="signup" onClick={handleSubmit}>
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
