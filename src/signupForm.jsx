import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: "",
      passwordInput: "",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.emailInput);
    console.log(this.state.passwordInput);
    createUserWithEmailAndPassword(
      auth,
      this.state.emailInput,

      this.state.passwordInput
    ).then(() => {
      this.setState({ emailInput: "", passwordInput: "" });
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // handleSignup = (email, password) => {
  //   createUserWithEmailAndPassword(auth, email, password);
  // };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            value={this.state.emailInput}
            id="emailInput"
            type="email"
            placeholder="enter your email here"
            onChange={this.handleChange}
          ></input>
          <input
            value={this.state.passwordInput}
            id="passwordInput"
            type="password"
            placeholder="give me your password"
            onChange={this.handleChange}
          ></input>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  }
}

export default SignUpForm;
