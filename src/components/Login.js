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
      <p class="text-2xl m-2 font-bold">Sign in</p>
      <form onSubmit={handleLogIn}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            class="p-1 rounded my-3 shadow"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required
            class="p-1 rounded my-3 shadow"
            autoComplete="password"
          />
        </div>
        <div>
          <button type="submit" class="bg-gray-800 text-white m-2  p-2">
            Sign In
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
