import React from "react";
import { auth } from "./firebase";
import {onAuthStateChanged } from "firebase/auth"
import logo from "./logo.png";
import "./App.css";
import NewsFeed from "./components/NewsFeed";
import Composer from "./components/Composer";
import AuthForm from "./components/AuthForm";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      loggedInUser: false, //To check if user is logged in (To alter the prompt button)
      shouldRenderAuthForm: false,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state);
  }

  //When an unauthenticated user clicks "Create Account or Sign In" button, 
  //App can call toggleAuthForm and render the auth form instead of the news feed.
  //Once the user authenticates, auth form logic can call toggleAuthForm again for App to render composer and news feed instead of auth form.
  toggleAuthForm = () => {
    this.setState((state) => ({
      shouldRenderAuthForm: !state.shouldRenderAuthForm, //change the state
    }));
  };


  render() {
    //Clean strategy learnt from Kai's code is to declare the constants

    const composer = <Composer />

    const createAccountOrSignInButton = ( //Initial page (everything click it toggle auth form)
      <div>
        <button onClick={this.toggleAuthForm}>Create Account Or Sign In</button> 
        <br />
      </div>
    );

    const composerAndNewsFeed = //If not logged in show the initial page; else; show composer
      <div>
        {/* Render composer if user logged in, else render auth button */}
        <NewsFeed />
        <br />
        {this.state.loggedInUser ? composer : createAccountOrSignInButton}
        
        
      </div>
    ;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Messaging Application</h1>
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {/* TODO: Add input field and add text input as messages in Firebase */}
          {this.state.shouldRenderAuthForm ? <p>Authorisation Form</p> : composerAndNewsFeed}
        </header>
      </div>
    );
  }
}

export default App;
