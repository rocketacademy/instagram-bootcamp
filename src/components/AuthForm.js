import React from "react";
import Button from "react-bootstrap/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

const defaultState = {
  emailInputValue: "",
  passwordInputValue: "",
  isNewUser: true,
  errorCode: "",
  errorMessage: "",
};

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  closeAuthForm = () => {
    // Reset auth form state
    this.setState(defaultState);
    // Toggle auth form off after authentication
    this.props.toggleAuthForm();
  };

  setErrorState = (error) => {
    this.setState({
      errorCode: error.code,
      errorMessage: error.message,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.emailInputValue || !this.state.passwordInputValue) return;

    // Authenticate user on submit
    if (this.state.isNewUser) {
      return createUserWithEmailAndPassword(
        auth,
        this.state.emailInputValue,
        this.state.passwordInputValue
      )
        .then(this.closeAuthForm)
        .catch(this.setErrorState);
    }

    return signInWithEmailAndPassword(
      auth,
      this.state.emailInputValue,
      this.state.passwordInputValue
    )
      .then(this.closeAuthForm)
      .catch(this.setErrorState);
  };

  toggleNewOrReturningAuth = () => {
    this.setState((prevState) => ({ isNewUser: !prevState.isNewUser }));
  };

  render() {
    return (
      <div>
        {this.state.errorCode && <p>{`Error code: ${this.state.errorCode}`}</p>}
        {this.state.errorMessage && (
          <p>{`Error message: ${this.state.errorMessage}`}</p>
        )}
        <p>Sign in here - password is 8 characters minimum.</p>
        <form>
          <div>
            <label>Username: </label>
            <input
              type="text"
              name="emailInputValue"
              value={this.emailInputValue}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              name="passwordInputValue"
              minLength="8"
              required
              value={this.passwordInputValue}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <Button onClick={this.handleSubmit}>
              {this.state.isNewUser ? "Create Account" : "Sign In"}
            </Button>
          </div>
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
