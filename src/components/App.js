import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import "./App.css";
import AuthForm from "./AuthForm";
import Composer from "./Composer";
import NewsFeed from "./NewsFeed";
import { auth } from "../firebase";
import logo from "../logo.png";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null,
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

  render() {
    const authForm = <AuthForm />;
    const composer = <Composer loggedInUser={this.state.loggedInUser} />;
    const createAccountOrSignInButton = (
      <div>
        <Link to="authform">Create Account Or Sign In</Link>
        <br />
      </div>
    );
    const composerAndNewsFeed = (
      <div>
        {/* Render composer if user logged in, else render auth button */}
        {this.state.loggedInUser ? composer : createAccountOrSignInButton}
        <br />
        <NewsFeed />
      </div>
    );
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <br />
          <Routes>
            <Route path="/" element={composerAndNewsFeed} />
            <Route path="authform" element={authForm} />
          </Routes>
        </header>
      </div>
    );
  }
}

export default App;
