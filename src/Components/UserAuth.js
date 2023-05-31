import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function UserAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName]=useState("");

  const signUp = async (displayName) => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {displayName})
    console.log(user);
    setDisplayName("");
    setEmail("");
    setPassword("");
  };

  const signIn = async () => {
    const user = await signInWithEmailAndPassword(auth, email, password);
    console.log(user);
    setDisplayName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <label>Username</label>
      <br />
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Username Here"
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
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password Here"
      />
      <br />

      <button onClick={()=>signUp(displayName)}>SignUp</button>
      <button onClick={signIn}>SignIn</button>
    </div>
  );
}
