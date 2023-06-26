import { useState } from "react";
import "../App.css";

import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function UserAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [displayName, setDisplayName] = useState("");

  const signUp = async (displayName) => {
    if (!displayName || !email || !password) {
      alert("Please do not leave the fields empty");
    }
    const user = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, { displayName }).then(() => {
      console.log("Profile updated successfully.");
      // Continue with the rest of the app logic here
      setDisplayName("");
      setEmail("");
      setPassword("");
    });
    console.log(user);
  };

  const signIn = async () => {
    if (!email || !password) {
      alert("Please do not leave the fields empty");
    }
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
    setDisplayName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <br />
      <label>Display Name</label>
      <br />
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Display Name Here"
      />
      <br />
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
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password Here"
      />

      <br />

      <button onClick={() => signUp(displayName)}>SignUp</button>
      <button onClick={signIn}>SignIn</button>
    </div>
  );
}
