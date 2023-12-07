import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleLogIn = async (e) => {
    e.preventDefault();
    if (!password || !email) return;

    try {
      const newUser = await signInWithEmailAndPassword(auth, email, password);
      console.log(newUser);
      setPassword("");
      setEmail("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h3>Sign in</h3>
      <form onSubmit={handleLogIn}>
        <label for="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email-text"
          style={{ display: "block" }}
        />
        <label for="password">Password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password-text"
          style={{ display: "block" }}
        />
        <button type="submit">Sign in</button>
      </form>
    </>
  );
};

export default Login;
