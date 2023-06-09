import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ isLoggedIn, username }) {
  const [email, SetEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = async () => {
    const user = createUserWithEmailAndPassword(auth, email, password);
    navigate("/newpost");

    SetEmail("");
    setPassword("");
  };

  const signIn = async () => {
    const user = signInWithEmailAndPassword(auth, email, password);
    navigate("/newpost");
    SetEmail("");
    setPassword("");
  };

  return (
    <>
      {isLoggedIn ? (
        <div>
          <h2>Welcome {username}</h2>
          <h5>Click on the left navigator to start posting!</h5>
        </div>
      ) : (
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => SetEmail(e.target.value)}
            placeholder="Email here"
          />
          <br />
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password here"
          />
          <br />
          <button onClick={signUp}>SignUp</button>
          <button onClick={signIn}>SignIn</button>
        </div>
      )}
    </>
  );
}
