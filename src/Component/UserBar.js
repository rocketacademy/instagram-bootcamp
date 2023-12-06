import { AppBar, Box, Button } from "@mui/material";
import UserMenu from "./UserMenu";
import { Link } from "react-router-dom";

export default function UserBar(props) {
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
              <Link to="/signup">
                <Button variant="contained">Sign up</Button>
              </Link>
              <Link to="/logIn">
                <Button variant="contained">Log in</Button>
              </Link>
            </div>
          )}
        </Box>
      </Box>
    </AppBar>
  );
}
