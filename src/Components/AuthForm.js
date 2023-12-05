import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";

import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

class AuthForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errorCode: "",
      errorMessage: "",
    };
  }

  setEmail = (e) => {
    this.setState({ email: e.target.value });
  };
  setPassword = (e) => {
    this.setState({ password: e.target.value });
  };

  signUp = async () => {
    await createUserWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    )
      .then(() => {
        this.setState({ email: "", password: "" });
      })
      .catch((error) => {
        this.setState({
          errorCode: error.code,
          errorMessage: error.message,
        });
      });
  };
  signIn = async () => {
    await signInWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    )
      .then(() => {
        this.setState({ email: "", password: "" });
      })
      .catch((error) => {
        this.setState({
          errorCode: error.code,
          errorMessage: error.message,
        });
      });
  };

  render() {
    return (
      <div className="error-message">
        <div>
          <p>{this.state.errorCode && `Error code: ${this.state.errorCode}`}</p>
          <p>
            {this.state.errorMessage &&
              `Error message: ${this.state.errorMessage}`}
          </p>
        </div>
        <label>Email</label>

        <input
          type="text"
          placeholder="Enter your email"
          value={this.state.email}
          onChange={this.setEmail}
        ></input>
        <br />
        <label>Password</label>

        <input
          type="text"
          placeholder="Enter your password"
          value={this.state.password}
          onChange={this.setPassword}
        ></input>
        <br />
        <Button className="mt-2" onClick={this.signIn}>
          Sign in
        </Button>
        <br />
        <Button className="mt-2 mb-3" onClick={this.signUp}>
          Sign up
        </Button>
      </div>
    );
  }
}

export default AuthForm;
