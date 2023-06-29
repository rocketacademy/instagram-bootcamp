import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { UserContext } from "../App";
import { useContext } from "react";

export default function Navbar({ logout, avatarURL }) {
  const [pages] = useState(["Chat", "Posts"]);
  const [settings] = useState(["Profile", "Logout"]);
  const [settingsNotUser] = useState(["Login", "Sign Up"]);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    const target = event.currentTarget;
    setAnchorElNav(target);
  };

  const handleOpenUserMenu = (event) => {
    const target = event.currentTarget;
    setAnchorElUser(target);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenu = (page) => {
    if (page === "Logout") {
      logout();
      setAnchorElUser(null);
    } else if (page === "Profile") {
      navigate("/instagram-bootcamp/profile");
    } else if (page === "Login") {
      navigate("/instagram-bootcamp/login");
    } else if (page === "Sign Up") {
      navigate("/instagram-bootcamp/signup");
    }
  };

  return (
    <div>
      <AppBar position="static" style={{ background: `#8b6041` }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <RocketLaunchIcon
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              ROCKETGRAM
            </Typography>
            <Box xs={2} />
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                name="anchorElNav"
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                open={Boolean(anchorElNav)}
                name="anchorElNav"
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <Link
                    key={page}
                    to={`/instagram-bootcamp/${page.toLowerCase()}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <MenuItem key={page}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Rocketgram
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Link
                  key={page}
                  to={`/instagram-bootcamp/${page.toLowerCase()}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    key={page}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="user" src={avatarURL} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                name="anchorElUser"
                onClose={handleCloseUserMenu}
              >
                {console.log(user.isLoggedIn)}
                {user.isLoggedIn && user.userID.length > 0 ? (
                  <div>
                    {settings.map((setting) => (
                      <MenuItem
                        key={setting}
                        name="anchorElUser"
                        onClick={() => handleUserMenu(setting)}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </div>
                ) : (
                  <div>
                    {console.log(
                      "I'm in else, isLoggedIn is : ",
                      user.isLoggedIn
                    )}
                    {settingsNotUser.map((setting1) => (
                      <MenuItem
                        key={setting1}
                        name="anchorElUser"
                        onClick={() => handleUserMenu(setting1)}
                      >
                        <Typography textAlign="center">{setting1}</Typography>
                      </MenuItem>
                    ))}
                  </div>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
