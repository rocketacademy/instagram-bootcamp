import { Button, DialogTitle, Input, List, Snackbar } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";

export default function SignUpForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackBar, setSnackBar] = useState(false);

  const handleSubmit = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(() => props.setSignUp(false))
      .catch(() => {
        setSnackBar(true);
      });
  };
  return (
    <div className="dialog">
      <DialogTitle>Sign Up</DialogTitle>
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
