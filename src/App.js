import React from "react";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  update,
  onValue,
} from "firebase/database";
import { database, storage } from "./firebase";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import "./App.css";

import { styled } from "@mui/material/styles";
import AspectRatio from "@mui/joy/AspectRatio";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Link from "@mui/joy/Link";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlined from "@mui/icons-material/ModeCommentOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import Face from "@mui/icons-material/Face";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import Fab from "@mui/material/Fab";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORE_FILES_KEY = "files";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      messageInput: "",
      fileInput: null,
      fileInputValue: "",
    };
  }

  componentDidMount() {
    const messagesRef = databaseRef(database, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [
          ...state.messages,
          {
            key: data.key,
            message: data.val().text,
            timestamp: data.val().timestamp,
            fileLink: data.val().fileLink,
            likes: data.val().likes,
            liked: false,
          },
        ],
      }));
    });
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  // writeData = () => {
  //   const messageListRef = ref(database, DB_MESSAGES_KEY);
  //   const newMessageRef = push(messageListRef);
  //   set(newMessageRef, "abc");
  // };

  handleMessageInputChange = (e) => {
    const { value } = e.target;
    this.setState({
      messageInput: value,
    });
  };

  handleFileInputChange = (e) => {
    this.setState({
      fileInput: e.target.files[0],
      fileInputValue: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const fileRef = storageRef(
      storage,
      `${STORE_FILES_KEY}/${this.state.fileInput.name}`
    );

    // Trying to add date (unsuccessfully)
    // const newMessageRef = push(messageListRef);
    // console.log("newMessageRef: ", newMessageRef);

    // console.log(timestamp.toLocaleString("en-GB").slice(0, -3));

    uploadBytesResumable(fileRef, this.state.fileInput).then(() => {
      getDownloadURL(fileRef).then((url) => {
        const messageListRef = databaseRef(database, DB_MESSAGES_KEY);
        const newMessageRef = push(messageListRef);
        const timestamp = new Date();
        const newMessage = {
          text: this.state.messageInput,
          timestamp: timestamp.toLocaleString("en-GB").slice(0, -3),
          fileLink: url,
          likes: 0,
        };
        set(newMessageRef, newMessage).then(() => {
          this.setState({
            messageInput: "",
            fileInput: null,
            fileInputValue: "",
            isMessageLiked: false,
          });
        });
      });
    });
  };

  // Fixed like button! It works!!!
  handleLikeClick = (e) => {
    console.log("Add a like");
    const { id } = e.target;
    console.log(id);
    let currentLikes;
    const messagesLiked = [...this.state.messages];
    const indexOfLiked = messagesLiked
      .map((message) => message.key)
      .indexOf(id);
    const likesRef = databaseRef(database, `${DB_MESSAGES_KEY}/${id}`);
    onValue(likesRef, (snapshot) => {
      currentLikes = snapshot.val().likes;
    });
    if (!this.state.messages[indexOfLiked].liked) {
      update(likesRef, { likes: parseInt(currentLikes) + 1 });
      messagesLiked[indexOfLiked].likes += 1;
      messagesLiked[indexOfLiked].liked = true;
    } else {
      update(likesRef, { likes: parseInt(currentLikes) - 1 });
      messagesLiked[indexOfLiked].likes -= 1;
      messagesLiked[indexOfLiked].liked = false;
    }
    this.setState({
      messages: messagesLiked,
    });
  };

  // handleDislikeClick = () => {
  //   console.log("Remove a like");
  //   const decrementLikes = this.state.numberOfLikes - 1;
  //   this.setState({
  //     isPostLiked: false,
  //     numberOfLikes: decrementLikes,
  //   });

  render() {
    const StyledFab = styled(Fab)({
      position: "absolute",
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: "0 auto",
    });

    // Convert messages in state to message JSX elements to render
    let messageListItems = this.state.messages.map((message) => (
      <div className="post-ctn post">
        <p className="username">pkaur</p>
        <p className="post-timestamp">{message.timestamp}</p>
        <img
          src={message.fileLink}
          alt="beautiful sunset"
          className="post-img"
        />
        <button
          id={message.key}
          value={this.state.isMessageLiked}
          onClick={this.handleLikeClick}
          className="like-btn"
        >
          👍 {message.likes}
        </button>
        <li key={message.key} className="post-text">
          <span className="username">pkaur</span> {message.text}
        </li>

        {/* <button
          id="dislikeButton"
          value={this.state.isPostDisliked}
          onClick={this.handleDislikeClick}
        >
          👎
        </button> */}
      </div>
    ));
    messageListItems.reverse();
    return (
      <div className="App">
        <header className="header-ctn">
          <h1>Rocketgram</h1>
          {/* TODO: Add input field and add text input as messages in Firebase */}
        </header>
        <main className="main-ctn">
          {/* <Card
            variant="outlined"
            sx={{
              minWidth: 300,
              "--Card-radius": (theme) => theme.vars.radius.xs,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", pb: 1.5, gap: 1 }}
            >
              <Box
                sx={{
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    m: "-2px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                  },
                }}
              >
                <Avatar
                  size="sm"
                  src="/static/logo.png"
                  sx={{
                    p: 0.5,
                    border: "2px solid",
                    borderColor: "background.body",
                  }}
                />
              </Box>
              <Typography fontWeight="lg">MUI</Typography>
              <IconButton
                variant="plain"
                color="neutral"
                size="sm"
                sx={{ ml: "auto" }}
              >
                <MoreHoriz />
              </IconButton>
            </Box>
            <CardOverflow>
              <AspectRatio>
                <img
                  src="https://images.unsplash.com/photo-1598449356475-b9f71db7d847?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
                  alt="sunset"
                  loading="lazy"
                />
              </AspectRatio>
            </CardOverflow>
            <Box sx={{ display: "flex", alignItems: "center", mx: -1, my: 1 }}>
              <Box sx={{ width: 0, display: "flex", gap: 0.5 }}>
                <IconButton variant="plain" color="neutral" size="sm">
                  <FavoriteBorder />
                </IconButton>
                <IconButton variant="plain" color="neutral" size="sm">
                  <ModeCommentOutlined />
                </IconButton>
                <IconButton variant="plain" color="neutral" size="sm">
                  <SendOutlined />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mx: "auto",
                }}
              >
                {[...Array(5)].map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      borderRadius: "50%",
                      width: `max(${6 - index}px, 3px)`,
                      height: `max(${6 - index}px, 3px)`,
                      bgcolor:
                        index === 0 ? "primary.solidBg" : "background.level3",
                    }}
                  />
                ))}
              </Box>
              <Box
                sx={{ width: 0, display: "flex", flexDirection: "row-reverse" }}
              >
                <IconButton variant="plain" color="neutral" size="sm">
                  <BookmarkBorderRoundedIcon />
                </IconButton>
              </Box>
            </Box>
            <Link
              component="button"
              underline="none"
              fontSize="sm"
              fontWeight="lg"
              textColor="text.primary"
            >
              8.1M Likes
            </Link>
            <Typography fontSize="sm">
              <Link
                component="button"
                color="neutral"
                fontWeight="lg"
                textColor="text.primary"
              >
                MUI
              </Link>{" "}
              The React component library you always wanted
            </Typography>
            <Link
              component="button"
              underline="none"
              fontSize="sm"
              startDecorator="…"
              sx={{ color: "text.tertiary" }}
            >
              more
            </Link>
            <Link
              component="button"
              underline="none"
              fontSize="10px"
              sx={{ color: "text.tertiary", my: 0.5 }}
            >
              2 DAYS AGO
            </Link>
            <CardOverflow sx={{ p: "var(--Card-padding)", display: "flex" }}>
              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                sx={{ ml: -1 }}
              >
                <Face />
              </IconButton>
              <Input
                variant="plain"
                size="sm"
                placeholder="Add a comment…"
                sx={{ flexGrow: 1, mr: 1, "--Input-focusedThickness": "0px" }}
              />
              <Link disabled underline="none" role="button">
                Post
              </Link>
            </CardOverflow>
          </Card> */}
          <form onSubmit={this.handleSubmit} className="form-ctn">
            <p>Add a new post</p>
            <input
              className="file-input"
              id="fileInput"
              type="file"
              value={this.state.fileInputValue}
              onChange={this.handleFileInputChange}
            />
            <br />
            <input
              className="message-input"
              type="text"
              id="messageInput"
              value={this.state.messageInput}
              placeholder="Type something..."
              onChange={this.handleMessageInputChange}
            />
            <input
              className="message-btn"
              type="submit"
              value="Post"
              disabled={!this.state.messageInput}
            />
            <br />
          </form>
          <ol className="posts-ctn">{messageListItems}</ol>
        </main>
        {/* <AppBar
          position="fixed"
          color="primary"
          sx={{ top: "auto", bottom: 0 }}
        >
          <Toolbar>
            <IconButton color="inherit" aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <StyledFab color="secondary" aria-label="add">
              <AddIcon />
            </StyledFab>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <MoreIcon />
            </IconButton>
          </Toolbar>
        </AppBar> */}
      </div>
    );
  }
}

export default App;
