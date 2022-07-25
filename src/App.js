import React from "react";
import Composer from "./Composer";
import NewsFeed from "./NewsFeed";
import AuthForm from "./AuthForm";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null,
      shouldRenderAuthForm: false,
    };
  }

  componentDidMount = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({
          loggedInUser: user,
        });
        return;
      } else {
        this.setState({
          loggedInUser: null,
        });
      }
    });
  };

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
      </div>
    );
    const composerAndNewsFeed = (
      <div>
        {this.state.loggedInUser ? composer : createAccountOrSignInButton}
        <br />
        <NewsFeed />
      </div>
    );
    return (
      <div className="App">
        <header className="App-header">
          {this.state.shouldRenderAuthForm ? authForm : composerAndNewsFeed}
        </header>
      </div>
    );
  }
}

export default App;
