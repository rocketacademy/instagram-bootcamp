import React from "react";
import Button from "react-bootstrap/Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";

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

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const closeAuthForm = () => {
      this.setState({
        emailInputValue: "",
        passwordInputValue: "",
        isNewUser: true,
        errorCode: "",
        errorMessage: "",
      });
      this.props.toggleAuthForm();
    };

    const setErrorState = (error) => {
      this.setState({
        errorCode: error.code,
        errorMessage: error.message,
      });
    };

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
      <div className="App-header">
        <h1 className="title">Rocketgram</h1>
        <p>{this.state.errorCode && `Error code: ${this.state.errorCode}`}</p>
        <p>
          {this.state.errorMessage &&
            `Error message: ${this.state.errorMessage}`}
        </p>
        <form onSubmit={this.handleSubmit}>
          <Form.Control
            type="text"
            placeholder="Username"
            name="emailInputValue"
            value={this.state.emailInputValue}
            onChange={this.handleChange}
          />
          <Form.Control
            type="text"
            placeholder="Password"
            name="passwordInputValue"
            value={this.state.passwordInputValue}
            onChange={this.handleChange}
          />
          <Button
            variant="primary"
            type="submit"
            disabled={
              !this.state.emailInputValue || !this.state.passwordInputValue
            }
          >
            {this.state.isNewUser ? "Create Account" : "Sign In"}
          </Button>
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
