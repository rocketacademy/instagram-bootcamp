import React from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthForm from "./AuthForm";
import NavigationBar from "./navbar";
import NewsFeed from "./NewsFeed";
import { Routes, Route, Outlet } from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      userEmail: "Guest",
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ userEmail: user.email });
      } else {
        this.setState({ userEmail: "Guest" });
      }
    });
  }

  toggleAuthForm = () => {
    this.setState({ shouldRenderAuthForm: !this.state.shouldRenderAuthForm });
  };

  userSignOut = () => {
    signOut(auth)
      .then(() => this.setState({ userEmail: "Guest" }))
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div className="App">
        <NavigationBar
          userSignOut={this.userSignOut}
          currentUser={this.state.userEmail}
        />
        <Routes>
          <Route
            path="/"
            element={<NewsFeed userEmail={this.state.userEmail} />}
          />
          <Route path="authform" element={<AuthForm />} />
        </Routes>
        <Outlet />
      </div>
    );
  }
}

export default App;
