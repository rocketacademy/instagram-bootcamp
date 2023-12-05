import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";

export const AuthFormFunction = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const signUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
    setEmail("");
    setPassword("");
  };

  const signIn = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <form className="flex w-full m-3">
      <input
        className="w-full mr-2 ml-5 input input-bordered"
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <input
        className="w-full mr-2 ml-5 input input-bordered"
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <div className="btn" onClick={signUp}>
        Sign Up
      </div>
      <div className="btn" onClick={signIn}>
        Sign In
      </div>
    </form>
  );
};
