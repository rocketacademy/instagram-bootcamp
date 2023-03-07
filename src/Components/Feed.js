import React from "react";
import {
  onChildAdded,
  push,
  ref as dbRef,
  set,
  onValue,
  update,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../firebase.js";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import PostForm from "./PostForm.js";
import { Outlet } from "react-router-dom";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";
const STORAGE_IMAGES_KEY = "images";

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      messages: [],
      message: "",
      timestamp: "",
      fileName: "",
      fileInput: null,
    };
    // Initialised local state. When Firebase changes, local state is updated.
  }

  componentDidMount() {
    const messagesRef = dbRef(database, DB_MESSAGES_KEY);
    onChildAdded(messagesRef, (data) => {
      const currentUserEmail = this.props.email;
      const likedUsers = data.val().likedUsers;
      const likedByCurrentUser = (likedUsers || []).includes(currentUserEmail);
      // The added child is added to local state to trigger re-render
      this.setState((state) => ({
        messages: [
          ...state.messages,
          {
            key: data.key,
            message: data.val().message,
            timestamp: data.val().timestamp,
            fileDownloadURL: data.val().fileDownloadURL,
            authorEmail: data.val().authorEmail,
            authorID: data.val().authorID,
            likes: data.val().likes,
            likedUsers: likedUsers,
            likedByCurrentUser: likedByCurrentUser,
            likeButtonColor: likedByCurrentUser ? "#ff5151" : "#ffb5b5",
          },
        ],
      }));
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.uid !== prevProps.uid) {
      const messagesToUpdate = [...this.state.messages];
      for (const message of messagesToUpdate) {
        message.likedByCurrentUser = (message.likedUsers || []).includes(
          this.props.email
        );
        message.likeButtonColor = message.likedByCurrentUser
          ? "#ff5151"
          : "#ffb5b5";
      }
      this.setState({ messages: messagesToUpdate });
    }
  }

  uploadFile = () => {
    const fileRef = storageRef(
      storage,
      `${STORAGE_IMAGES_KEY}/${this.state.fileName}`
    );
    return uploadBytesResumable(fileRef, this.state.fileInput)
      .then((snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      })
      .then(() => getDownloadURL(fileRef))
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = errorCode.split("/")[1].replaceAll("-", " ");
        alert(`Wait a minute... an error occurred: ${errorMessage}`);
      });
  };

  writeData = (url) => {
    const messageListRef = dbRef(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    return set(newMessageRef, {
      message: this.state.message,
      timestamp: this.state.timestamp,
      fileDownloadURL: url,
      likes: 0,
      likedUsers: [""],
      authorEmail: this.props.email,
      authorID: this.props.uid,
    });
  };

  renderMessageItems = () => {
    let messageListItems = this.state.messages.map((item, index) => (
      <Card key={item.key}>
        <Card.Img
          variant="top"
          key={`${item.key}-img`}
          src={item.fileDownloadURL}
          alt={item.message}
          id={item.key}
          onClick={this.props.onClick}
        />
        <Card.Text key={`${item.key}-m`} className="message">
          {item.message}
        </Card.Text>
        <Card.Footer key={`${item.key}-ft`}>
          <div className="footer-data">
            <div key={`${item.key}-ts`} className="timestamp">
              {item.timestamp}
            </div>
            <div className="auth-email">{item.authorEmail}</div>
          </div>
          <div className="like-item">
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 350 }}
              overlay={
                <Tooltip key={`${item.key}-tt`}>
                  {item.likedUsers.slice(1).map((user) => (
                    <div className="liked-users" key={user}>
                      {user}
                    </div>
                  ))}
                </Tooltip>
              }
            >
              <div className="likes">{item.likes}</div>
            </OverlayTrigger>
            <Button
              name={item.key}
              className="like-btn"
              variant="outline-danger"
              onClick={this.handleLike}
              disabled={!this.props.authenticated}
              style={{ color: item.likeButtonColor }}
            >
              ♥
            </Button>
          </div>
        </Card.Footer>
      </Card>
    ));
    return messageListItems;
  };

  handleTextChange = (e) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (e) => {
    this.setState({
      fileInput: e.target.files[0],
      fileName: e.target.files[0].name,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.message.length === 0 || !this.state.fileInput) {
      alert("Upload something and write a message!");
      return;
    }
    new Promise((resolve) => {
      this.setState({ timestamp: new Date().toLocaleString("en-GB") }, resolve);
    })
      .then(this.uploadFile)
      .then(this.writeData)
      .then(() => {
        this.setState({
          message: "",
          timestamp: "",
          fileName: "",
          fileInput: null,
        });
        this.inputRef.current.value = "";
      });
  };

  handleLike = (e) => {
    let currentLikes;
    let currentLikedUsers;
    const messagesToUpdate = [...this.state.messages];
    const indexOfLiked = messagesToUpdate
      .map((message) => message.key)
      .indexOf(e.target.name);
    const likedMessage = messagesToUpdate[indexOfLiked];
    const likedMessageRef = dbRef(
      database,
      `${DB_MESSAGES_KEY}/${e.target.name}`
    );
    onValue(likedMessageRef, (snapshot) => {
      currentLikes = parseInt(snapshot.val().likes);
      currentLikedUsers = snapshot.val().likedUsers;
    });
    if (!likedMessage.likedByCurrentUser) {
      update(likedMessageRef, {
        likes: currentLikes + 1,
        likedUsers: [...currentLikedUsers, this.props.email],
      });
      likedMessage.likes += 1;
      likedMessage.likedUsers = [...likedMessage.likedUsers, this.props.email];
      likedMessage.likedByCurrentUser = true;
      likedMessage.likeButtonColor = "#ff5151";
    } else {
      update(likedMessageRef, {
        likes: currentLikes - 1,
        likedUsers: [...currentLikedUsers.slice(0, -1)],
      });
      likedMessage.likes -= 1;
      likedMessage.likedUsers = [...likedMessage.likedUsers.slice(0, -1)];
      likedMessage.likedByCurrentUser = false;
      likedMessage.likeButtonColor = "#ffb5b5";
    }
    this.setState({ messages: messagesToUpdate });
  };

  render() {
    return (
      <div className="feed">
        <div className="container">
          {this.renderMessageItems()}
          {this.props.authenticated && (
            <PostForm
              handleFileChange={this.handleFileChange}
              handleTextChange={this.handleTextChange}
              message={this.state.message}
              inputRef={this.inputRef}
              handleSubmit={this.handleSubmit}
            />
          )}
          <Outlet />
        </div>
      </div>
    );
  }
}
