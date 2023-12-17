import React from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth();

class AuthForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailInputValue: "",
      passwordInputValue: "",
      isNewUser: false,
      errorCode: "",
      errorMessage: "",
    };
  }

  handleEmailInputChange = (event) => {
    this.setState({
      emailInputValue: event.target.value,
    });
  };

  handlePasswordInputChange = (event) => {
    this.setState({
      passwordInputValue: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitting form");
    const closeAuthForm = () => {
      console.log("User signed in:");
      this.setState({
        emailInputValue: "",
        passwordInputValue: "",
        //isNewUser: null,
        errorCode: "",
        errorMessage: "",
      });
      this.props.setLoggedIn(true);
    };

    const setErrorState = (error) => {
      console.error("Authentication error:", error);
      this.setState({
        errorCode: error.code,
        errorMessage: error.message,
      });
    };

    if (this.state.isNewUser) {
      console.log("Attempting to create new user");
      createUserWithEmailAndPassword(
        auth,
        this.state.emailInputValue,
        this.state.passwordInputValue
      )
        .then(closeAuthForm)
        .catch(setErrorState);
    } else {
      console.log("Attempting to sign in user");
      signInWithEmailAndPassword(
        auth,
        this.state.emailInputValue,
        this.state.passwordInputValue
      )
        .then(closeAuthForm)
        .catch(setErrorState);
    }
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
        <p> Sign in with this form to post.</p>
        <form onSubmit={(event) => this.handleSubmit(event)}>
          <input
            type="email"
            placeholder="Enter your email"
            value={this.state.emailInputValue}
            onChange={(event) => this.handleEmailInputChange(event)}
          ></input>
          <br></br>
          <input
            type="password"
            autoComplete="on"
            placeholder="Enter your password"
            value={this.state.passwordInputValue}
            onChange={(event) => this.handlePasswordInputChange(event)}
          ></input>
          <input
            type="submit"
            value={this.state.isNewUser ? "Create Account" : "Sign In"}
            disabled={
              !this.state.emailInputValue || !this.state.passwordInputValue
            }
          ></input>
          <button variant="link" onClick={this.toggleNewOrReturningAuth}>
            {this.state.isNewUser
              ? "If you have an account, click here to login"
              : "If you are a new user, click here to create account"}
          </button>
        </form>
      </div>
    );
  }
}

export default AuthForm;
