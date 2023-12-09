import React from "react";
import FileUploadForm from "./Components/FileUploadForm";
import MessageForm from "./Components/MessageForm";
import PostDisplay from "./Components/PostDisplay";
import ChatMessages from "./Components/ChatMessages";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { NavBar } from "./Components/NavBar";
import { ChatMessagesFunction } from "./Components/ChatMessagesFunction";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      loggedInUser: false,
      user: {},
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        this.setState({
          loggedInUser: true,
          user: user,
        });
      }
    });
  }

  signOut = () => {
    this.setState({
      loggedInUser: false,
      user: {},
    });
    signOut(auth);
  };

  render() {
    console.log(this.state.loggedInUser);
    return (
      <>
        <div className="flex flex-col justify-between lg:flex-row ">
          {this.state.loggedInUser ? (
            <p className="btn btn-ghost text-xl">
              Hello, {this.state.user.email}
            </p>
          ) : (
            <p className="btn btn-ghost text-xl">
              Please sign in to chat and post~
            </p>
          )}
          <NavBar
            loggedInUser={this.state.loggedInUser}
            signOut={this.signOut}
          />
        </div>
        <div className="flex flex-col items-start pb-10 lg:flex-row lg:justify-around">
          <div className="flex flex-col h-[680px] mt-2">
            <ChatMessagesFunction />
            <div className="flex lg:justify-between m-2">
              {this.state.loggedInUser ? <MessageForm /> : null}
            </div>
          </div>
          <div className="h-[500px] mt-5">
            <p className="text-lg text-center font-semibold">
              {" "}
              Album Highlights
            </p>
            <PostDisplay />
            {this.state.loggedInUser ? <FileUploadForm /> : null}
          </div>
        </div>
      </>
    );
  }
}

export default App;
