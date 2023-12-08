import React from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { update } from "firebase/database";
import { onChildAdded, push, ref, set } from "firebase/database";
import { database, storage } from "./firebase";
import Post from "./Post";
import Header from "./Header";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const DB_MESSAGES_KEY = "messages";
const STORAGE_KEY = "images/";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null,
      likes: false,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ loggedInUser: user });
        return;
      }
      this.setState({ loggedInUser: null });
    });
  }

  handleSignOut = () => {
    auth.signOut().then(() => {
      this.setState({
        loggedInUser: null,
      });
      alert("You have signed out successfully!");
    });
  };

  handleLikes = (updatedMessage) => {
    const messageIndex = this.state.messages.findIndex(
      (message) => message.key === updatedMessage.key
    );

    // Create a copy of the current state's messages array
    const updatedMessages = [...this.state.messages];

    // Update the likes count for the specific message
    updatedMessages[messageIndex] = updatedMessage;

    // Update the state with the modified messages array
    this.setState({
      messages: updatedMessages,
    });
  };

  render() {
    return (
      <div className="App">
        <Header
          loggedInUser={this.state.loggedInUser}
          onSignOut={this.handleSignOut}
        />
        <Post
          loggedInUser={this.state.loggedInUser}
          onLikes={this.handleLikes}
        />
      </div>
    );
  }
}

export default App;
