import React from "react";

import logo from "./logo.png";
import "./App.css";

import AuthForm from "./Component/AuthForm";
import UploadPost from "./Component/UploadPost";
import Newsfeed from "./Component/Newsfeed";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_MESSAGES_KEY = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      name: "To update in App.js",
      loggedInUser: false,
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          {/* Input box for user to enter name, Entered name will be registered in current session */}
          {!this.state.loggedInUser && <AuthForm />}

          {/* Input form for user to enter post message, upload photo*/}
          {this.state.loggedInUser && (
            <div>
              <br />
              User: {this.state.name}
              <UploadPost DB_MESSAGES_KEY={DB_MESSAGES_KEY} />
              <br />
            </div>
          )}

          {/* Renders Newsfeed*/}
          <Newsfeed
            messages={this.state.messages}
            DB_MESSAGES_KEY={DB_MESSAGES_KEY}
          />
        </header>
      </div>
    );
  }
}

export default App;
