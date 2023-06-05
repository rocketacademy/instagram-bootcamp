import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Link, Routes, Route } from "react-router-dom";

// import components
import InstagramFeed from "./Component/InstagramFeed.js";
import InstagramForm from "./Component/InstagramForm";
import AuthField from "./Component/AuthField";

// firebase
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedinUser: null,
      showAuthField: false,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      // If user is logged in, save logged-in user to state
      if (user) {
        this.setState({ loggedInUser: user });
        return;
      }
      // Else set logged-in user in state to null
      this.setState({ loggedInUser: null });
    });
  }

  toggleAuthForm = () => {
    this.setState((state) => ({
      shouldRenderAuthForm: !state.shouldRenderAuthForm,
    }));
  };

  render() {
    const authForm = <AuthField toggleAuthForm={this.toggleAuthForm} />;
    const composer = <InstagramForm loggedInUser={this.state.loggedInUser} />;
    const createAccountOrSignInButton = (
      <div>
        <button onClick={this.toggleAuthForm}>Create Account Or Sign In</button>
        <br />
      </div>
    );
    const composerAndNewsFeed = (
      <div>
        {/* Render composer if user logged in, else render auth button */}
        {this.state.loggedInUser ? composer : createAccountOrSignInButton}
        <br />
        <InstagramFeed />
      </div>
    );
    return (
      <div className="App">
        <header className="App-header">
          <h1>Rocketgram 🚀</h1>
          <AuthField />
        </header>
        {this.state.shouldRenderAuthForm ? authForm : composerAndNewsFeed}
        <InstagramFeed />
      </div>
    );
  }
}

export default App;
