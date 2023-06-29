import React from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import PostForm from "./PostForm";
import { UserContext } from "../App";
import { useContext } from "react";

export default function Welcome() {
  const user = useContext(UserContext);

  return (
    <div>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Box bgcolor="inherit" p={2}>
            <div justify="center">
              {console.log(user.isLoggedIn)}
              {user.isLoggedIn ? (
                <div>
                  <PostForm />
                </div>
              ) : (
                <div className="login_signup_buttons">
                  <Link to="/instagram-bootcamp/login">
                    <Button
                      name="login"
                      sx={{ "&.MuiButton-text": { color: "#b28a6d" } }}
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/instagram-bootcamp/signup">
                    <Button
                      name="login"
                      sx={{ "&.MuiButton-text": { color: "#b28a6d" } }}
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      Signup
                    </Button>
                  </Link>
                </div>
              )}

              <br />
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
