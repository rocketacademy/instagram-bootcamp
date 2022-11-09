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

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.emailInputValue || !this.state.passwordInputValue) return;

    const closeAuthForm = () => {
      // Reset auth form state
      this.setState({
        emailInputValue: "",
        passwordInputValue: "",
        isNewUser: true,
        errorCode: "",
        errorMessage: "",
      });
      // // Toggle auth form off after authentication
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
    this.setState((prevState) => ({ isNewUser: !prevState.isNewUser }));
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
        <p>Sign in here - password is 8 characters minimum.</p>
        <form>
          <label>Username: </label>
          <input
            type="text"
            name="emailInputValue"
            value={this.emailInputValue}
            onChange={this.handleInputChange}
          />
          <br />
          <label>Password: </label>
          <input
            type="password"
            name="passwordInputValue"
            minLength="8"
            required
            value={this.passwordInputValue}
            onChange={this.handleInputChange}
          />
          <br />
          <Button onClick={this.handleSubmit}>
            {this.state.isNewUser ? "Create Account" : "Sign In"}
          </Button>
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
