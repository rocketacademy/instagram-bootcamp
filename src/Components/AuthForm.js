import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    console.log(user);
    setEmail("");
    setPassword("");
  };

  const signIn = async () => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <label>Email</label>
      <br />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

      <button onClick={signUp}>Sign Up</button>
      <button onClick={signIn}>Sign In</button>
    </div>
  );
}
