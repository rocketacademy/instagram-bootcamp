import React from "react";
import { Tabs, Tab, Grid, AppBar, Toolbar, Typography } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

export default class Navbar extends React.Component {
  constructor() {
    super();

    this.state({
      tabs: "",
    });
  }

  render() {
    return (
      <div>
        <AppBar>
          <Toolbar>
            <Grid container>
              <Grid item xs={2}>
                <Typography>
                  <RocketLaunchIcon />
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Tabs indicatorColor="secondary" textColor="inherit" value={1} onChange={}>
                  <Tab label="Chatroom" />
                  <Tab label="Posts" />
                </Tabs>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
