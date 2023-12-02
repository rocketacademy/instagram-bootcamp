import { AppBar, Avatar, Box, Button, Dialog } from "@mui/material";
import SignUpForm from "./SignUpForm";
import LogInForm from "./LogInForm";
import { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function UserBar(props) {
  const [signUp, setSignUp] = useState(false);
  const [logIn, setLogIn] = useState(false);

  return (
    <AppBar className="">
      <Box className="user-bar">
        <Box>Rocketgram</Box>
        {props.user && <h6>Welcome, {props.user.email}</h6>}
        <Box>
          {props.user ? (
            <div>
              <div>
                <Button
                  variant="contained"
                  onClick={() => {
                    signOut(auth);
                  }}
                >
                  Log out
                </Button>
              </div>
              <Avatar></Avatar>{" "}
            </div>
          ) : (
            <div>
              <Button variant="contained" onClick={() => setSignUp(true)}>
                Sign up
              </Button>

              <Button variant="contained" onClick={() => setLogIn(true)}>
                Log in
              </Button>
            </div>
          )}
        </Box>
      </Box>
      <Dialog open={signUp} onClose={() => setSignUp(false)} className="dialog">
        <SignUpForm setSignUp={setSignUp} />
      </Dialog>
      <Dialog open={logIn} onClose={() => setLogIn(false)} className="dialog">
        <LogInForm setLogIn={setLogIn} />
      </Dialog>
    </AppBar>
  );
}
