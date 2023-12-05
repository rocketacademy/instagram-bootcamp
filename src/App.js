import React from "react";
import FileUploadForm from "./Components/FileUploadForm";
import MessageForm from "./Components/MessageForm";
import PostDisplay from "./Components/PostDisplay";
import ChatMessages from "./Components/ChatMessages";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { NavBar } from "./Components/NavBar";
import { AuthFormFunction } from "./Components/AuthFormFunction";

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
    return (
      <>
        <div className="flex flex-row justify-center">
          {this.state.loggedInUser ? (
            <NavBar name={this.state.user.email} />
          ) : (
            <NavBar name={"Unknown! Please sign in to chat & upload!"} />
          )}
          {this.state.loggedInUser ? (
            <div className="btn p-2 m-2" onClick={this.signOut}>
              Sign Out
            </div>
          ) : (
            <AuthFormFunction />
          )}
        </div>
        <div className="flex flex-col items-center pb-10 lg:flex-row lg:justify-around">
          <div className="flex flex-col h-screen">
            <ChatMessages />
            <div className="flex lg:justify-between m-2 mb-10">
              {this.state.loggedInUser ? <MessageForm /> : null}
            </div>
          </div>
          <div>
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
