import React from "react";
import { auth } from "./firebase";
import {onAuthStateChanged, signOut } from "firebase/auth"
// import logo from "./logo.png";
import "./App.css";
import NewsFeed from "./components/NewsFeed";
import Composer from "./components/Composer";
import AuthForm from "./components/AuthForm";
import {Button} from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      loggedInUser: null, //To check if user is logged in (To alter the prompt button)
      shouldRenderAuthForm: false,
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      console.log("Auth State Triggered");
      // If user is logged in, save logged-in user to state
      if (user) {
        console.log(`User Registered: ${user}`)
        this.setState({ loggedInUser: user });
        return;
      }
      // Else set logged-in user in state to null
      this.setState({ loggedInUser: null });
      
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("App State Updated!");
    console.log(this.state)
    console.log(this.state.loggedInUser ? "yes" : "no")
  }

  //When an unauthenticated user clicks "Create Account or Sign In" button, 
  //App can call toggleAuthForm and render the auth form instead of the news feed.
  //Once the user authenticates, auth form logic can call toggleAuthForm again for App to render composer and news feed instead of auth form.
  toggleAuthForm = () => {
    this.setState((state) => ({
      shouldRenderAuthForm: !state.shouldRenderAuthForm, //change the state
    }));
  };

  signOut = () => {
    signOut(auth, (user) => {
      console.log('Signed Out');
      this.setState({
        loggedInUser: null, //To check if user is logged in (To alter the prompt button)
        shouldRenderAuthForm: false,
      });

    })
    
  };


  render() {
    //Clean strategy learnt from Kai's code is to declare the constants

    const composer = (
      <div>
        <Composer />
        <button onClick={this.signOut}> Sign Out </button>
      </div>
    
    )
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
          {this.state.shouldRenderAuthForm ? <AuthForm toggleAuthForm={this.toggleAuthForm} /> : composerAndNewsFeed}
          
        </header>
      </div>
    );
  }
}

export default App;
