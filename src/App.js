import React from "react";
import FileUploadForm from "./Components/FileUploadForm";
import MessageForm from "./Components/MessageForm";
import PostDisplay from "./Components/PostDisplay";
import ChatMessages from "./Components/ChatMessages";
import AuthForm from "./Components/AuthForm";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { NavBar } from "./Components/NavBar";

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
    console.log(this.state.user);
    return (
      <>
        {this.state.loggedInUser ? (
          <NavBar name={this.state.user.email} />
        ) : (
          <NavBar name={"Unknown User"} />
        )}
        <div className="h-screen flex flex-col items-center justify-end pb-10 lg:flex-row lg:justify-around">
          <div className="">
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
            {this.state.loggedInUser ? <FileUploadForm /> : <AuthForm />}
            {this.state.loggedInUser ? (
              <div className="btn" onClick={this.signOut}>
                Sign Out
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

export default App;
