import React from "react";
import AuthForm from "./components/AuthForm";
import Composer from "./components/Composer";
import NewsFeed from "./components/NewsFeed";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import logo from "./logo.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/Nav";
import { signOut } from "firebase/auth";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null,
      shouldRenderAuthForm: false,
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

  signOutUser() {
    signOut(auth).then(() => {
      this.setState({ loggedInUser: null });
    });
  }

  toggleAuthForm = () => {
    this.setState((state) => ({
      shouldRenderAuthForm: !state.shouldRenderAuthForm,
    }));
  };

  render() {
    const authForm = <AuthForm toggleAuthForm={this.toggleAuthForm} />;
    const composer = <Composer loggedInUser={this.state.loggedInUser} />;
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
        <NewsFeed />
      </div>
    );
    return (
      <div className="App">
        <Nav
          loggedInUser={this.state.loggedInUser}
          signOutUser={this.signOutUser}
        />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <br />
          {this.state.shouldRenderAuthForm ? authForm : composerAndNewsFeed}
        </header>
      </div>
    );
  }
}

export default App;
