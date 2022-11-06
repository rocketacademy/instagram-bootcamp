import React from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import logo from "../logo.png";
import "./App.css";
import Composer from "./Composer.js";
import NewsFeed from "./NewsFeed.js";
import AuthForm from "./AuthForm.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      loggedInUser: null,
      shouldRenderAuthForm: false,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, saved logged-in user to state
        this.setState({ loggedInUser: user });
        return;
      }

      // User is signed out
      this.setState({ loggedInUser: null });
    });
  }

  toggleAuthForm = (event) => {
    this.setState((prevState) => ({
      shouldRenderAuthForm: !prevState.shouldRenderAuthForm,
    }));
  };

  render() {
    const { loggedInUser, shouldRenderAuthForm } = this.state;
    console.log(shouldRenderAuthForm);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" /> <br />
          {/* If user is logged in, then show Composer form for user to choose image and input msg */}
          {loggedInUser && <Composer loggedInUser={loggedInUser} />}
          {!loggedInUser && !shouldRenderAuthForm && (
            <button onClick={this.toggleAuthForm}>
              Create Account or Sign In
            </button>
          )}
          {!loggedInUser && shouldRenderAuthForm && (
            <AuthForm toggleAuthForm={this.toggleAuthForm} />
          )}
          {/* Show Newsfeed of the images, when created and text */}
          {!shouldRenderAuthForm && <NewsFeed />}
        </header>
      </div>
    );
  }
}

export default App;
