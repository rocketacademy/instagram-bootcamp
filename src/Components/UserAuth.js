import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function UserAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    console.log("sign up"+user);
    setEmail("");
    setPassword("");
  };

  const signIn = async () => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log("sign in"+user);
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <label>Email</label>
      <br />
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Here"
      />
      <br />
      <label>Password</label>
      <br />
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password Here"
      />
      <br />

      <button onClick={signUp}>SignUp</button>
      <button onClick={signIn}>SignIn</button>
    </div>
  );
}
