import React from "react";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { database, auth } from "./firebase";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthForm from "./AuthForm";
import Postcards from "./Postcards";
import NavigationBar from "./navbar";
import CreatePost from "./CreatePost";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const MESSAGE_FOLDER_NAME = "messages";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      messages: [],
      shouldRenderAuthForm: false,
      userEmail: "Guest",
    };
  }

  componentDidMount() {
    const messagesRef = databaseRef(database, MESSAGE_FOLDER_NAME);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(messagesRef, (data) => {
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState((state) => ({
        // Store message key so we can use it as a key in our list items when rendering messages
        messages: [...state.messages, { key: data.key, val: data.val() }],
      }));
    });

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
          toggleAuth={this.toggleAuthForm}
          userSignOut={this.userSignOut}
          currentUser={this.state.userEmail}
        />
        <div>
          <AuthForm
            showForm={this.state.shouldRenderAuthForm}
            toggleForm={this.toggleAuthForm}
          />
        </div>
        <div>
          {this.state.userEmail === "Guest" ? (
            <p>Sign in to start posting</p>
          ) : (
            <CreatePost currentUser={this.state.userEmail} />
          )}
        </div>
        <div>
          <Postcards messages={this.state.messages} />
        </div>
      </div>
    );
  }
}

export default App;
