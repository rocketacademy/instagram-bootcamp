import React from "react";
import Button from "react-bootstrap/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInputValue: "",
      passwordInputValue: "",
      isNewUser: true,
      errorCode: "",
      errorMessage: "",
    };
  }

  // Use a single method to control email and password form inputs
  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      // Reset auth form state
      this.setState({
        emailInputValue: "",
        passwordInputValue: "",
        isNewUser: true,
        errorCode: "",
        errorMessage: "",
      });
      // Toggle auth form off after authentication
      this.props.toggleAuthForm();
    };

    const setErrorState = (error) => {
      this.setState({
        errorCode: error.code,
        errorMessage: error.message,
      });
    };

    // Authenticate user on submit
    if (this.state.isNewUser) {
      createUserWithEmailAndPassword(
        auth,
        this.state.emailInputValue,
        this.state.passwordInputValue
      )
        .then(closeAuthForm)
        .catch(setErrorState);
    } else {
      signInWithEmailAndPassword(
        auth,
        this.state.emailInputValue,
        this.state.passwordInputValue
      )
        .then(closeAuthForm)
        .catch(setErrorState);
    }
  };

  toggleNewOrReturningAuth = () => {
    this.setState((state) => ({ isNewUser: !state.isNewUser }));
  };

  render() {
    return (
      <div>
        <p>
          {this.state.errorCode ? `Error code: ${this.state.errorCode}` : null}
        </p>
        <p>
          {this.state.errorMessage
            ? `Error message: ${this.state.errorMessage}`
            : null}
        </p>
        <p>Sign in with this form to post.</p>
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
            value={this.state.isNewUser ? "Create Account" : "Sign In"}
            // Disable form submission if email or password are empty
            disabled={
              !this.state.emailInputValue || !this.state.passwordInputValue
            }
          />
          <br />
          <Button variant="link" onClick={this.toggleNewOrReturningAuth}>
            {this.state.isNewUser
              ? "If you have an account, click here to login"
              : "If you are a new user, click here to create account"}
          </Button>
        </form>
      </div>
    );
  }
}

export default AuthForm;
