import React from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInputValue: "",
      passwordInputValue: "",
      isNewUser: true,
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(
      auth,
      this.state.emailInputValue,
      this.state.passwordInputValue
    ).then(console.log("registered"));
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        Email:
        <input
          type="email"
          name="emailInputValue"
          value={this.state.emailInputValue}
          onChange={this.handleInputChange}
        ></input>
        <br />
        Password:
        <input
          type="password"
          name="passwordInputValue"
          value={this.state.passwordInputValue}
          onChange={this.handleInputChange}
        ></input>
        <br />
        <input type="submit"></input>
      </form>
    );
  }
}

export default AuthForm;
