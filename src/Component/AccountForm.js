import { Button, Dialog, DialogTitle } from "@mui/material";
import { useState } from "react";
import SignUpForm from "./SignUpForm";
import LogInForm from "./LogInForm";

export default function AccountForm() {
  const [signUp, setSignUp] = useState(false);
  const [LogIn, setLogIn] = useState(false);

  return (
    <p>
      Please <Button onClick={() => setSignUp(true)}>Sign up</Button> or{" "}
      <Button onClick={() => setLogIn(true)}>Log in</Button>.
      <Dialog open={signUp} onClose={() => setSignUp(false)}>
        <DialogTitle>Sign Up</DialogTitle>
        <SignUpForm />
      </Dialog>
      <Dialog open={LogIn} onClose={() => setLogIn(false)}>
        <DialogTitle>Log In</DialogTitle>
        <LogInForm />
      </Dialog>
    </p>
  );
}
