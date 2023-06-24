import React from "react";
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

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: ["Chatroom", "Posts"],
      settings: ["Profile", "Logout"],
      anchorElUser: null,
      anchorElNav: null,
    };
  }

  handleOpenNavMenu = (event) => {
    const target = event.currentTarget;
    this.setState({
      anchorElNav: target,
    });
  };

  handleOpenUserMenu = (event) => {
    const target = event.currentTarget;
    this.setState({
      anchorElUser: target,
    });
  };

  handleCloseNavMenu = () => {
    this.setState({
      anchorElNav: null,
    });
  };

  handleCloseUserMenu = () => {
    this.setState({
      anchorElUser: null,
    });
  };

  render() {
    const { pages, anchorElNav, anchorElUser, settings } = this.state;
    console.log(pages);
    return (
      <div>
        <AppBar position="static" color="secondary">
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
                  onClick={this.handleOpenNavMenu}
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
                  onClose={this.handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() => this.props.pageClick(page)}
                    >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
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
                  <Button
                    key={page}
                    onClick={() => this.props.pageClick(page)}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={this.handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="user" src="" />
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
                  onClose={this.handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      name="anchorElUser"
                      onClick={this.handleCloseUserMenu}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </div>
    );
  }
}
