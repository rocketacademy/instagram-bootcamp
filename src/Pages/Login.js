import { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { TextField } from "@mui/material";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <Box textAlign="left">
        <Grid item xs={10}>
          <h2>LOGIN</h2>
          <p>If you are a new user, please click on Sign Up.</p>
        </Grid>
        <Grid>
          <Box xs={7} lg={6}>
            <Grid item xs={10} sm={7} md={5}>
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
                size="small"
                InputProps={{ sx: { height: 45 } }}
                focused
                required
              />
              <br />
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
                  onClick={() => props.handleLogin(email, password)}
                  size="small"
                >
                  Submit
                </Button>

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
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </div>
  );
}
