import React from "react";
// import { push, ref, set } from "firebase/database";
// import { database } from "./firebase";
import "./App.css";

//import UI component from Mui
import { Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import PostAddIcon from "@mui/icons-material/PostAdd";
// import CssBaseline from "@mui/material/CssBaseline";
// import TextField from "@mui/material/TextField";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import makeStyles from "@mui/material/styles";
// import Container from "@mui/material/Container";

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
          <h2>Welcome to Rocketgram! 🚀</h2>
          <h3>Choose a page to visit.</h3>
          <Button
            variant="contained"
            endIcon={<ChatIcon />}
            name="chatroom"
            onClick={this.handleClick}
          >
            Chatroom
          </Button>
          <Button
            variant="contained"
            endIcon={<PostAddIcon />}
            name="postroom"
            onClick={this.handleClick}
          >
            Posts
          </Button>
          {chatroom && (
            <div>
              <MessageList />
              <br />
              <ChatCall />
            </div>
          )}
          {postroom && (
            <div>
              <PostForm />
              <br />
              <PostList />
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
