import React from "react";
import { realTimeDatabase } from "./firebase";
import { onChildAdded, ref as realTimeDatabaseRef } from "firebase/database";

import logo from "./logo.png";
import "./App.css";

import UserLogin from "./Component/UserLogin";
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
      messages: [],
    };
  }

  componentDidMount() {
    const messagesRef = realTimeDatabaseRef(realTimeDatabase, DB_MESSAGES_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          {/* Input box for user to enter name, Entered name will be registered in current session */}
          {this.state.name === "" && (
            <UserLogin
              handleNameSubmit={this.handleNameSubmit}
              handleNameChange={this.handleNameChange}
              nameInput={this.state.nameInput}
            />
          )}
          {/* Input form for user to enter post message, upload photo*/}
          {this.state.name !== "" && (
            <div>
              <br />
              User: {this.state.name}
              <UploadPost DB_MESSAGES_KEY={DB_MESSAGES_KEY} />
              <br />
              {/* Renders Newsfeed*/}
              <Newsfeed
                messages={this.state.messages}
                DB_MESSAGES_KEY={DB_MESSAGES_KEY}
              />
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
