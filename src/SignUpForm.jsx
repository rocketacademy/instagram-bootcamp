import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailInput: null,
      passwordInput: null,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.id === "signup") {
      this.props.handleSignup(this.state.emailInput, this.state.passwordInput);
    } else {
      this.props.handleLogin(this.state.emailInput, this.state.passwordInput);
    }
    /*  createUserWithEmailAndPassword(
      this.props.auth,
      this.state.emailInput,
      this.state.passwordInput
    ).then(() => {
      this.setState({
        emailInput: null,
        passwordInput: null,
      });
    }); */
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <form /* onSubmit={this.handleSubmit} */>
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
            placeholder="enter password"
            onChange={this.handleChange}
          ></input>
          <button id="signup" onClick={this.handleSubmit}>
            Sign Up
          </button>
          <button id="login" onClick={this.handleSubmit}>
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default SignUpForm;
