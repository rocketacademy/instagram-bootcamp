import React from "react";
import "./App.css";
import logo from "./logo.png";
import InstagramPost from "./Components/instagram-post";
import InstagramAuth from "./Components/Instagram-authentication";
import InstagramFeed from "./Components/Instagram-feed";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: null,
      renderAuthentication: false,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ userLoggedIn: user });
        return;
      } else {
        this.setState({ userLoggedIn: null });
      }
    });
  }

  toggleAuthentication = () => {
    this.setState((state) => ({
      renderAuthentication: !state.renderAuthentication,
    }));
  };

  render() {
    const instagramAuth = (
      <InstagramAuth toggleAuthentication={this.toggleAuthentication} />
    );
    const instagramPost = (
      <InstagramPost userLoggedIn={this.state.userLoggedIn} />
    );
    const createAccountOrSignIn = (
      <div>
        <button onClick={this.toggleAuthentication}>
          Click here to create an account or sign in
        </button>
      </div>
    );
    const postAndNewsFeed = (
      <div>
        {this.state.userLoggedIn ? instagramPost : createAccountOrSignIn}
        <br />
        <InstagramFeed />
      </div>
    );

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <br />
          {this.state.renderAuthentication ? instagramAuth : postAndNewsFeed}
        </header>
      </div>
    );
  }
}
