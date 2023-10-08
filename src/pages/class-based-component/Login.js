import React from "react";
import "../App.css";
import { auth } from "../../firebase.js";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
      user: {},
    };
  }

  logOut = () => {
    signOut(auth).then(() => {
      console.log("Signed Out");
    });
  };

  onChange = (e) => {
    let { id, value } = e.target;

    this.setState({
      [id]: value,
    });
  };

  onUserRegistration = async () => {

    return createUserWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    ).then((userInfo) => {
      console.log(userInfo)
      console.log("Successfull signed up");
      this.setState({
        email: "",
        password: "",
      });
    });
  }

  onUserSignIn = async () => {
    return signInWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    ).then((userInfo) => {
      console.log(userInfo)
      console.log("Successfull sign in");
      this.setState({
        user: userInfo.user,
        isLoggedIn: true
      })
    })      
  }

  componentDidMount() {
    // Listen to the "auth" object to get the current user.
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        this.setState({
          // Signed in user
          user: userInfo,
          isLoggedIn: true,
        });
      } else {
        // NO signed in user
        this.setState({
          user: {},
          isLoggedIn: false,
        });
      }
    });
  }

  render() {
    return (
      <div className="App">

      </div>
    );
  }
}
