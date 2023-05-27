import React from "react";
import { auth } from "./firebase";
import {onAuthStateChanged } from "firebase/auth"
import logo from "./logo.png";
import "./App.css";
import NewsFeed from "./components/NewsFeed";
import Composer from "./components/Composer";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      loggedInUser: true,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state);
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Messaging Application</h1>
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {/* TODO: Add input field and add text input as messages in Firebase */}
          <NewsFeed />
          {this.state.loggedInUser ? <Composer /> : <button>Create Account or Sign In</button>}
          
        </header>
      </div>
    );
  }
}

export default App;
