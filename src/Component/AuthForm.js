import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function AuthForm() {
  const [email, SetEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const user = createUserWithEmailAndPassword(auth, email, password);
    console.log(user);

    SetEmail("");
    setPassword("");
  };

  const signIn = async () => {
    const user = signInWithEmailAndPassword(auth, email, password);
    console.log(user);

    SetEmail("");
    setPassword("");
  };

  return (
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
  );
}
