import {
  Button,
  DialogTitle,
  Input,
  List,
  Snackbar,
  Dialog,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

export default function LogInForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackBar, setSnackBar] = useState(false);
  const [open, setOpen] = useState(true);

  const handleSubmit = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => setOpen(false))
      .catch(() => {
        setSnackBar(true);
      });
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      className="dialog"
    >
      <DialogTitle>Log In</DialogTitle>
      <Snackbar
        open={snackBar}
        message="Wrong Email/Password"
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
          type="password"
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
          Log in!
        </Button>
      </List>
      {!open && <Navigate to="/" />}
    </Dialog>
  );
}
