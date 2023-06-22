import React from "react";
import "./App.css";

//import UI component from Mui
// import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
// import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MessageList from "./Component/MesssageList";
import ChatCall from "./Component/ChatCall";
import PostForm from "./Component/PostForm";
import PostList from "./Component/PostList";

class App extends React.Component {
  constructor() {
    super();
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      currentPage: "home",
      userID: "",
      chatroom: false,
      postroom: false,
    };
  }

  handleClick = (e) => {
    const { name } = e.target;
    if (name === "chatroom") {
      this.setState({
        chatroom: true,
        postroom: false,
      });
    } else if (name === "postroom") {
      this.setState({
        postroom: true,
        chatroom: false,
      });
    }
  };

  render() {
    const { chatroom, postroom } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <Box sx={{ flexGrow: 1, width: 600 }}>
            <Grid container spacing={2} justify="center">
              <Grid item xs={12}>
                <h2>Welcome to Rocketgram! 🚀</h2>
              </Grid>
              <Grid item xs={12}>
                <h3>Choose a page to visit.</h3>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Button
                  variant="contained"
                  endIcon={<ChatIcon />}
                  name="chatroom"
                  onClick={this.handleClick}
                >
                  Chatroom
                </Button>
              </Grid>
              <Grid item={6}>
                <Button
                  variant="contained"
                  endIcon={<PostAddIcon />}
                  name="postroom"
                  onClick={this.handleClick}
                >
                  Posts
                </Button>
              </Grid>
              <Grid item xs={12}>
                {chatroom && (
                  <div>
                    <MessageList />
                    <br />
                    <ChatCall />
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                {postroom && (
                  <div justify="center">
                    <PostForm />
                    <br />
                    <PostList />
                  </div>
                )}
              </Grid>
            </Grid>
          </Box>
        </header>
      </div>
    );
  }
}

export default App;
