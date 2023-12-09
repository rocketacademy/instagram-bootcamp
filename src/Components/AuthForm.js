import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Form, Row } from "react-bootstrap";
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
      <div>
        <p>Please sign up / sign in to post.</p>
        <Form>
          <Form.Group
            as={Row}
            className="mb-3 align-items-center"
            controlId="formPlaintextEmail"
          >
            <Form.Label column sm="4">
              Email
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="Enter your email"
                value={this.state.email}
                onChange={this.setEmail}
              />
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className="mb-3 align-items-center"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="4">
              Password
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={this.state.password}
                onChange={this.setPassword}
              />
            </Col>
          </Form.Group>
        </Form>
        <div className="errorMessage">
          <p>{this.state.errorCode && `Error code: ${this.state.errorCode}`}</p>
          <p>
            {this.state.errorMessage &&
              `Error message: ${this.state.errorMessage}`}
          </p>
        </div>
        <div>
          <p className="preLoginMessage">
            New user? Click "sign up" to register your account.
          </p>
          <Button
            className="mb-4"
            variant="outline-light"
            onClick={this.signUp}
          >
            Sign up
          </Button>
        </div>
        <div>
          <p className="preLoginMessage">
            Already have an account? Click "sign in" to log in.
          </p>
          <Button
            className="mb-4"
            variant="outline-light"
            onClick={this.signIn}
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }
}

export default AuthForm;
