import React from "react";

export default class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: "",
      passwordInput: "",
    };
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({
      [id]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { id } = e.target;
    const { emailInput, passwordInput } = this.state;
    if (id === "signup") {
      this.props.handleSignUp(emailInput, passwordInput);
    } else if (id === "login") {
      this.props.handleLogIn(emailInput, passwordInput);
    }
    this.setState({
      emailInput: "",
      passwordInput: "",
    });
  };

  render() {
    return (
      <form className="login">
        <input
          id="emailInput"
          type="email"
          value={this.state.emailInput}
          onChange={this.handleChange}
          placeholder="Enter email here"
        ></input>
        <input
          id="passwordInput"
          type="password"
          value={this.state.passwordInput}
          onChange={this.handleChange}
          placeholder="Enter password"
        ></input>
        <button id="signup" onClick={this.handleSubmit}>
          Sign Up
        </button>
        <button id="login" onClick={this.handleSubmit}>
          Login
        </button>
      </form>
    );
  }
}
