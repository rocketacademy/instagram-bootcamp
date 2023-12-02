import React from "react";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import AuthForm from "./AuthForm";
import PostForm from "./PostForm";
import Feed from "./Feed";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: false,
      user: null,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      if (user) {
        this.setState({ isUserLoggedIn: true, user: user });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header>Rocketgram</header>
        {this.state.isUserLoggedIn ? <PostForm /> : <AuthForm />}
        <Feed />
      </div>
    );
  }
}

export default App;
