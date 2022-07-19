import React from "react";
import Posts from "./Posts";
import Register from "./Register";
import Signin from "./Signin";
import { getAuth, onAuthStateChanged } from "firebase/auth";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      loggedInUser: "",
    };
  }

  componentDidMount = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.setState({
        loggedInUser: user,
      });
    });
  };

  render() {
    return (
      <>
        <Register />
        <Signin />
        <Posts />;
      </>
    );
  }
}

export default App;
