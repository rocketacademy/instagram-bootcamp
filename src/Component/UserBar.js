import { AppBar, Box, Button, Dialog } from "@mui/material";
import SignUpForm from "./SignUpForm";
import LogInForm from "./LogInForm";
import { useState } from "react";
import UserMenu from "./UserMenu";

export default function UserBar(props) {
  const [signUp, setSignUp] = useState(false);
  const [logIn, setLogIn] = useState(false);

  return (
    <AppBar>
      <Box className="user-bar">
        <Box>Rocketgram</Box>
        {props.user && (
          <h6>
            Welcome,{" "}
            {props.user.displayName ? props.user.displayName : props.user.email}
          </h6>
        )}
        <Box>
          {props.user ? (
            <UserMenu user={props.user} updateUser={props.updateUser} />
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
