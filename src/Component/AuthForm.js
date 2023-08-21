import React from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

class UserLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      nameInput: "",
      email: "",
      password: "",
    };
  }

  handleSignUpClick = async () => {
    const user = await createUserWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    );
    console.log(user);
    this.setState = {
      email: "",
      password: "",
    };
  };

  handleSignInClick = async () => {
    const user = await signInWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    );
    console.log(user);
    this.setState = {
      email: "",
      password: "",
    };
  };

  render() {
    return (
      //Input for user to sign up or sign in
      <div>
        <br />
        <label>Email</label>
        <br />
        <input
          type="text"
          value={this.state.email}
          onChange={(e) => this.setState({ email: e.target.value })}
          placeholder="Enter email"
        />
        <br />
        <br />
        <label>Password</label>
        <br />
        <input
          type="text"
          value={this.state.password}
          onChange={(e) => this.setState({ password: e.target.value })}
          placeholder="Enter password"
        />{" "}
        <button onClick={this.handleSignUpClick}>SignUp</button>
        <button onClick={this.handleSignInClick}>SignIn</button>
      </div>
    );
  }
}

export default UserLogin;
