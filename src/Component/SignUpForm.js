import { Button, Input, List, Snackbar } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackBar, setSnackBar] = useState(false);

  const handleSubmit = async () => {
    await createUserWithEmailAndPassword(auth, email, password).catch(
      (error) => {
        setSnackBar(true);
      }
    );
  };
  return (
    <div className="account">
      <Snackbar
        open={snackBar}
        message="Email already registered"
        onClose={() => setSnackBar(false)}
        autoHideDuration={2000}
      />
      <List>
        <label>Please enter your email:</label>
      </List>
      <List>
        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </List>
      <List>
        <label>Please enter your password:</label>
      </List>
      <List>
        <Input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </List>
      <List>
        <Button
          onClick={() => {
            handleSubmit();
          }}
          variant="contained"
        >
          Sign Up!
        </Button>
      </List>
    </div>
  );
}
