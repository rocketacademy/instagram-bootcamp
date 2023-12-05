import React from "react";
import Feed from "../src/Components/Feed/Feed";
import Chat from "../src/Components/Chat/Chat";
import AuthForm from "../src/Components/AuthForm/AuthForm";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./App.css";

const auth = getAuth();

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
      if (user) {
        this.setState({
          loggedInUser: user,
        });
        return;
      } else {
        this.setState({ loggedInUser: null });
      }
    });
  }

  toggleAuthForm = () => {
    this.setState({
      shouldRenderAuthForm: true,
    });
  };

  render() {
    const authForm = <AuthForm toggleAuthForm={this.state.toggleAuthForm} />;
    const chat = <Chat loggedInUser={this.state.loggedInUser} />;
    const createAccountOrSignInButton = (
      <div>
        <button onClick={(event) => this.toggleAuthForm(event)}>
          Create Account Or Sign In
        </button>
        <br />
      </div>
    );
    const chatAndFeed = (
      <div>
        {this.state.loggedInUser ? chat : createAccountOrSignInButton}
        <br />
        <Feed />
      </div>
    );

    return (
      <div className="App">
        <header className="App-header">
          <br />
          {this.state.shouldRenderAuthForm ? authForm : chatAndFeed}
        </header>
      </div>
    );
  }
}

export default App;
