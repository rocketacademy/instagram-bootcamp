import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default class InstagramAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInputValue: "",
      passwordInputValue: "",
      newUser: true,
      errorCode: "",
      errorMessage: "",
    };
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthentication = () => {
      this.setState({
        emailInputValue: "",
        passwordInputValue: "",
        newUser: true,
        errorCode: "",
        errorMessage: "",
      });
      this.props.toggleAuthForm();
    };

    if (this.state.newUser) {
      createUserWithEmailAndPassword(
        auth,
        this.state.emailInputValue,
        this.state.passwordInputValue,
      ).then(closeAuthentication);
    } else {
      signInWithEmailAndPassword(
        auth,
        this.state.emailInputValue,
        this.state.passwordInputValue,
      ).then(closeAuthentication);
    }
  };

  toggleNewOrReturningUser = () => {
    this.setState((state) => ({ newUser: !state.newUser }));
  };

  render() {
    return (
      <div>
        <p>Please sign in to continue</p>
        <form onSubmit={this.handleSubmit}>
          <label>
            <span>Email: </span>
            <input
              type="email"
              name="emailInputValue"
              value={this.state.emailInputValue}
              onChange={this.handleInputChange}
            />
          </label>
          <br />
          <label>
            <span>Password: </span>
            <input
              type="password"
              name="passwordInputValue"
              value={this.state.passwordInputValue}
              onChange={this.handleInputChange}
            />
          </label>
          <br />
          <input
            type="submit"
            value={this.state.newUser ? "Create new account" : "Sign in"}
            disabled={
              !this.state.emailInputValue || !this.state.passwordInputValue
            }
          />
          <br />
          <button variant="link" onClick={this.toggleNewOrReturningUser}>
            {this.state.newUser
              ? "If you have an account, click here to log in instead"
              : "If you are a new user, click here to create an account"}
          </button>
        </form>
      </div>
    );
  }
}
