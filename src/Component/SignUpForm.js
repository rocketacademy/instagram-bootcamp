import {
  Button,
  DialogTitle,
  Input,
  List,
  Snackbar,
  Dialog,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackBar, setSnackBar] = useState(false);
  const [open, setOpen] = useState(true);

  const handleSubmit = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setOpen(false);
      })
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
    >
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
      {!open && <Navigate to="/" />}
    </Dialog>
  );
}
