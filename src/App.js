import React from "react";
import "./App.css";
import Composer from "./Page/Composer";
import NewsFeed from "./Page/NewsFeed";
import AuthForm from "./Page/AuthForm";
import ErrorPage from "./Page/ErrorPage";
import NavBar from "./Component/NavBar";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Routes, Route } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import InstagramIcon from "@mui/icons-material/Instagram";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        setUsername(capitalizeFirstLetter(user.email.split("@")[0]));
      } else {
        setIsLoggedIn(false);
        setUser({});
      }
    });
  }, []);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Grid container>
      <NavBar />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "hotpink",
        }}
      >
        <Toolbar>
          <InstagramIcon sx={{ mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ROCKETGRAM
          </Typography>
          {isLoggedIn ? (
            <>
              <Avatar>{username.charAt(0)} </Avatar>

              <IconButton
                sx={{ mr: 1 }}
                title="Sign Out"
                onClick={(e) => {
                  setIsLoggedIn(false);
                  signOut(auth);
                  setUser({});
                }}
              >
                <LogoutIcon sx={{ p: 0 }} />
              </IconButton>
            </>
          ) : null}
        </Toolbar>
      </AppBar>
      <Box>
        <Toolbar />
        <Routes>
          <Route path="/" element={<NewsFeed username={username} />} />
          <Route
            path="/login"
            element={<AuthForm username={username} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/newpost"
            element={<Composer username={username} isLoggedIn={isLoggedIn} />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Box>
    </Grid>
  );
}

export default App;
