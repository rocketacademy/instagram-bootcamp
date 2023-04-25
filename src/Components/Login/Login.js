import { useState } from "react";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LoginForm = () => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id } = e.target;
    if (id === "signup") {
      createUserWithEmailAndPassword(auth, emailInput, passwordInput).then(
        () => {
          navigate("/");
        }
      );
    } else if (id === "login") {
      signInWithEmailAndPassword(auth, emailInput, passwordInput).then(() => {
        navigate("/");
      });
    }
  };

  return (
    <div className="login">
      <h1>Login or Sign Up</h1>
      <form>
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
        <div className="login-buttons">
          <button id="login" onClick={handleSubmit}>
            Login
          </button>
          <button id="signup" onClick={handleSubmit}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
