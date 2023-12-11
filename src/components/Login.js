import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../App";
import useInput from "./hooks/useInput";

const Login = () => {
  const [password, setNewPassword, resetPassword] = useInput("");
  const [email, setNewEmail, resetEmail] = useInput("");
  const { setIsUserLoggedIn, setMsg, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();
    if (!password || !email) return;

    try {
      const newUser = await signInWithEmailAndPassword(auth, email, password);
      // console.log(newUser); keeping this here instead of deleting for future reference
      setIsUserLoggedIn(true);
      setUser(newUser.user);
      setMsg("");
      resetEmail();
      resetPassword();
      navigate("/feed");
    } catch (error) {
      setMsg(error.message);
    }
  };

  return (
    <>
      <p class="header">Sign In</p>

      <form onSubmit={handleLogIn}>
        <div>
          <input
            type="email"
            placeholder="Email"
            {...setNewEmail}
            name="email"
            class="input"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...setNewPassword}
            name="password"
            required
            class="input"
            autoComplete="password"
          />
        </div>
        <div>
          <button type="submit" class="btn">
            Sign In
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
