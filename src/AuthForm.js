import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

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

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      //reset to initial state
      this.setState({
        emailInputValue: "",
        passwordInputValue: "",
        isNewUser: true,
        errorCode: "",
        errorMessage: "",
      });
      //toggle authform
      this.props.toggleAuthForm();
    };

    const setErrorState = (error) => {
      //set errorCode and errorMessage
      this.setState({
        errorCode: error.code,
        errorMessage: error.message,
      });
    };

    //chhange below to if create else signin
    //if new user, run createUserWithEmailAndPassword()
    //.then run closeAuthForm
    //.catch setErrorState
    //else run signInWithEmailandPassword()
    //.then run closeAuthForm
    //.catch setErrorState
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
    this.setState((state) => ({
      isNewUser: !state.isNewUser,
    }));
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
        <form onSubmit={this.handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              name="emailInputValue"
              value={this.state.emailInputValue}
              onChange={this.handleInputChange}
            />
          </label>
          <br />
          <label>
            Password:
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
            disabled={
              !this.state.emailInputValue || !this.state.passwordInputValue
            }
          />
          <input
            type="button"
            onClick={this.toggleNewOrReturningAuth}
            value={
              this.state.isNewUser
                ? "If you have an account, click here to login"
                : "If you are a new user, click here to create account"
            }
          />
        </form>
      </div>
    );
  }
}

export default AuthForm;
