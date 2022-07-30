import React from "react";
import { Chat } from "./Chat";
import { Posts } from "./Posts";
import logo from "./logo.png";
import "./App.css";
import { UserAuth } from "./UserAuth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userIsLoggedIn: false,
      userID: "",
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState(() => ({
          userIsLoggedIn: true,
          userID: user.uid,
        }));
      } else {
        this.setState(() => ({
          userIsLoggedIn: false,
          userID: "",
        }));
      }
    });
  }

  render() {
    return (
      <>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            {!this.state.userIsLoggedIn ? (
              <UserAuth login="false" />
            ) : (
              <UserAuth login="true" />
            )}
            {this.state.userIsLoggedIn && <Chat />}
            <br />
            {this.state.userIsLoggedIn && <Posts />}
          </header>
        </div>
      </>
    );
  }
}

export default App;
