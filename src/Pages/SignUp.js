import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";

export default function SignUp(props) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <Box textAlign="left">
        <Grid item xs={10}>
          <h2>SIGN UP</h2>
          <p>To login, please click on Login.</p>
        </Grid>
        <Grid>
          <Box xs={7} lg={6}>
            <Grid item xs={10} sm={7} md={5}>
              <TextField
                type="text"
                name="displayName"
                label="Display Name"
                color="secondary"
                variant="filled"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                size="small"
                InputProps={{ sx: { height: 45 } }}
                focused
                required
              />
              <br />
              <TextField
                type="text"
                name="email"
                label="Email"
                color="secondary"
                variant="filled"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                size="small"
                InputProps={{ sx: { height: 45 } }}
                focused
                required
              />
              <br />

              <TextField
                type="password"
                name="password"
                label="Password"
                color="secondary"
                variant="filled"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="min. 6 characters"
                size="small"
                InputProps={{ sx: { height: 45 } }}
                focused
                required
              />

              <Box
                component="span"
                m={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: 210 }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => props.signup(email, password, displayName)}
                >
                  Submit
                </Button>
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
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Box>
      ;
    </div>
  );
}
