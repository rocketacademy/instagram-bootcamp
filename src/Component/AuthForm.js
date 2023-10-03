import { useState } from "react";

import { auth } from "../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import "./AuthForm.css";

export default function AuthForm({ setUser }) {
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const signUp = async () => {
    await createUserWithEmailAndPassword(auth, newEmail, newPassword);
    await updateProfile(auth.currentUser, { displayName });
    setUser(auth.currentUser);
    setNewEmail("");
    setNewPassword("");
    setDisplayName("");
  };

  const signIn = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    setUser(auth.currentUser);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="main-container">
      <div className="SU-SI-Container">
        <label>User Name</label>
        <input
          className="auth-input"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="User Name Here"
        />
        <label>Email</label>
        <input
          className="auth-input"
          type="text"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Email Here"
        />
        <label>Password</label>
        <input
          className="auth-input"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Password Here"
        />
        <button className="auth-button" onClick={signUp}>
          Sign Up
        </button>
      </div>
      <div className="SU-SI-Container">
        <label>Email</label>
        <input
          className="auth-input"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Here"
        />
        <label>Password</label>
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password Here"
        />
        <button className="auth-button" onClick={signIn}>
          Sign In
        </button>
      </div>
    </div>
  );
}
