import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import getFirebaseErrorMessage from "../../Utils/getFirebaseErrorMessage";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login | Rocketgram";
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    await login(email, password)
      .then((res) => {
        navigate("/home");
      })
      .catch((error) => {
        setError(getFirebaseErrorMessage(error));
      });
  };

  return (
    <div>
      <div>
        <div>Rocketgram Logo</div>
        <h1>Login</h1>
      </div>
      <div>
        <form onSubmit={handleLogin}>
          <input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p>Error: {error}</p>}
        <div>
          Don't have an account?{" "}
          <span>
            <Link to={"/register"}>Register Now</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
