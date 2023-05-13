import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import getFirebaseErrorMessage from "../../Utils/getFirebaseErrorMessage";
import doesUsernameExist from "../../Utils/doesUsernameExist";
import { ref as databaseRef, set } from "firebase/database";
import { database } from "../../firebase";
import defaultavatar from "../../Images/defaultavatar.png";
import { updateProfile } from "firebase/auth";

function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Register | Rocketgram";
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else if (await doesUsernameExist(displayName)) {
      setError("Username is already taken");
    } else {
      try {
        const credentials = await register(email, password, displayName);
        const newUser = credentials.user;
        const newUserRef = databaseRef(database, "users/" + newUser.uid);
        await set(newUserRef, {
          email: email,
          photoURL: defaultavatar,
          regDate: newUser.metadata.creationTime,
          lastOnline: newUser.metadata.lastSignInTime,
          username: displayName,
          status: "online",
        });
        await updateProfile(newUser, {
          displayName: displayName,
          photoURL: defaultavatar,
        });
        navigate("/home");
      } catch (error) {
        setError(getFirebaseErrorMessage(error));
      }
    }
  };

  return (
    <div>
      <div>
        <div>Rocketgram Logo</div>
        <h1>Register</h1>
      </div>
      <div>
        <form onSubmit={handleRegister}>
          <input
            label="Username"
            type="text"
            placeholder="Username"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
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
          <input
            label="Confirm password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        {error && <p>Error: {error}</p>}
        <div>
          Already have an account?{" "}
          <span>
            <Link to={"/login"}>Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
