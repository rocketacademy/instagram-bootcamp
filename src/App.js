import React from "react";
import FileUploadForm from "./Components/FileUploadForm";
import MessageForm from "./Components/MessageForm";
import PostDisplay from "./Components/PostDisplay";
import ChatMessages from "./Components/ChatMessages";
import AuthForm from "./Components/AuthForm";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

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

  render() {
    return (
      <>
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
          </div>
        </div>
      </>
    );
  }
}

export default App;
