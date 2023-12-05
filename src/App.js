import React from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import AuthForm from "./AuthForm";
import Post from "./Post";
import Header from "./Header";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null,
      showAuthForm: false,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ loggedInUser: user });
        return;
      }
      this.setState({ loggedInUser: null });
    });
  }

  handleSignOut = () => {
    auth.signOut().then(() => {
      this.setState({
        loggedInUser: null,
        showAuthForm: true,
      });
    });
  };

  toggleAuthForm = () => {
    this.setState((prevState) => ({ showAuthForm: !this.state.showAuthForm }));
  };

  render() {
    const post = <Post loggedInUser={this.state.loggedInUser} />;
    const authForm = <AuthForm toggleAuthForm={this.toggleAuthForm} />;

    return (
      <div className="App">
        {this.state.loggedInUser && (
          <Header
            loggedInUser={this.state.loggedInUser}
            onSignOut={this.handleSignOut}
          />
        )}
        {this.state.showAuthForm ? authForm : post}
      </div>
    );
  }
}

export default App;
