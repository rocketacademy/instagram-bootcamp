import React from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Post from "./Post";
import Header from "./Header";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: null,
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
      });
      alert("You have signed out successfully!");
    });
  };

  render() {
    const post = <Post loggedInUser={this.state.loggedInUser} />;

    return (
      <div className="App">
        <Header
          loggedInUser={this.state.loggedInUser}
          onSignOut={this.handleSignOut}
        />
        {post}
      </div>
    );
  }
}

export default App;
