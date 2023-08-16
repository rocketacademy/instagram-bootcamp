import React from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

export function WithNavigate(Component) {
  function Wrapper(props) {
    const navigate = useNavigate();

    return <Component navigate={navigate} {...props} />;
  }
  return Wrapper;
}

class Authform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputEmailValue: "",
      inputPwdValue: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ [event.target.name]: value });
  }

  signup(event) {
    event.preventDefault();
    const user = createUserWithEmailAndPassword(
      auth,
      this.state.inputEmailValue,
      this.state.inputPwdValue
    ).then(this.setState({ inputEmailValue: "", inputPwdValue: "" }));
    this.props.navigate("/posts");
    console.log(user);
  }

  login(event) {
    event.preventDefault();
    const user = signInWithEmailAndPassword(
      auth,
      this.state.inputEmailValue,
      this.state.inputPwdValue
    ).then(this.setState({ inputEmailValue: "", inputPwdValue: "" }));
    this.props.navigate("/posts");
    console.log(user);
  }

  render() {
    return (
      <div className="App">
        <h1>Welcome please login or signup</h1>
        <br />
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="inputEmailValue"
              placeholder="Enter email"
              value={this.state.inputEmailValue}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="inputPwdValue"
              placeholder="Password"
              value={this.state.inputPwdValue}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="button" onClick={this.signup}>
            Signup
          </Button>{" "}
          <Button variant="primary" type="button" onClick={this.login}>
            Login
          </Button>
        </Form>
      </div>
    );
  }
}

export default WithNavigate(Authform);
