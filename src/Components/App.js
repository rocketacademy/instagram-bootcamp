import React from "react";

// import { auth } from "./firebase";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
import PostForm from "./PostForm";
import Feed from "./Feed";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <header>Rocketgram</header>
        <PostForm />
        <Feed />
      </div>
    );
  }
}

export default App;
