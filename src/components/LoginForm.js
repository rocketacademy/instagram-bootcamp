import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export function LoginForm({ user, setNewUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();

  const loginUser = (e, email, password) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <form onSubmit={(e) => loginUser(e, email, password)}>
        <h3>Login user</h3>
        <div>Email</div>
        <input name="email" onChange={(e) => setEmail(e.target.value)}></input>
        <div>Password</div>
        <input
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <br></br>
        <button type="submit">Login</button>
      </form>
      <br></br>
      <p
        onClick={() => setNewUser(1)}
        onMouseEnter={(e) => (
          (e.target.style.color = "red"), (e.target.style.cursor = "pointer")
        )}
        onMouseLeave={(e) => (e.target.style.color = "white")}
      >
        New here? Click here
      </p>
    </>
  );
}
