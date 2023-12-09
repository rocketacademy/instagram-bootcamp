import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const AuthFormFunction = () => {
  const navigate = useNavigate();
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
    navigate("/");
  };

  const signIn = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    setEmail("");
    setPassword("");
    navigate("/");
  };

  return (
    <form className="flex flex-col lg:flex-row lg:w-full mt-3">
      <input
        className="w-full mr-1 ml-1 input input-bordered"
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <input
        className="w-full mr-1 ml-1 input input-bordered"
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <div className="btn mr-1 ml-1" onClick={signUp}>
        Sign Up
      </div>
      <div className="btn mr-1 ml-1" onClick={signIn}>
        Sign In
      </div>
      <div className="btn mr-1 ml-1">
        <Link to="/">Home</Link>
      </div>
    </form>
  );
};
