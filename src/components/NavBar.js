import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function NavBar(props) {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            RocketGram
          </Typography>
          <Typography sx={{ color: "white", mr: 2 }}>
            {props.user?.email}
          </Typography>
          <Button onClick={handleLogout}>
            <Typography sx={{ color: "white" }}>
              {props.user?.email && "Logout"}
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
