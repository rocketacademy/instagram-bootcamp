import * as React from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function LoginForm(props) {
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user);
      navigate("/chat");
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoginEmail("");
      setLoginPassword("");
    }
  };

  const handleLogin = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user);
      navigate("/chat");
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoginEmail("");
      setLoginPassword("");
    }
  };

  return (
    <Grid>
      <Paper
        elevation={10}
        sx={{ padding: 10, height: "25vh", width: 250, margin: "30px auto" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Login or Register to Post</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </Grid>
          <Button
            onClick={handleLogin}
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Login
          </Button>
          <Button
            onClick={handleRegister}
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Register
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default LoginForm;
