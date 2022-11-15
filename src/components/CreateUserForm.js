import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export function CreateUserForm({ user, setNewUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();

  function createUser(e, email, password) {
    e.preventDefault();
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          console.log(user);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  return (
    <>
      <form onSubmit={(e) => createUser(e, email, password)}>
        <h3>Create user</h3>
        <div>Email</div>
        <input name="email" onChange={(e) => setEmail(e.target.value)}></input>
        <div>Password</div>
        <input
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <br></br>
        <button type="submit">Create user</button>
      </form>
      <br></br>
      <p
        onClick={() => setNewUser(0)}
        onMouseEnter={(e) => (e.target.style.color = "red", e.target.style.cursor = "pointer")}
        onMouseLeave={(e) => (e.target.style.color = "white")}
      >
        Already have an account? Login here
      </p>
    </>
  );
}
