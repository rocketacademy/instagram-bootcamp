import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: "",
      passwordInput: "",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(
      auth,
      this.state.emailInput,
      this.state.passwordInput
    )
      .then((userCredential) => {
        console.log("somebody has signed in");

        const user = userCredential.user;
      })

      .then(() => {
        this.setState({ emailInput: "", passwordInput: "" });
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("theres is an error signing in");
      });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            value={this.state.emailInput}
            name="emailInput"
            type="email"
            placeholder="enter your email here"
            onChange={this.handleChange}
          ></input>
          <input
            value={this.state.passwordInput}
            name="passwordInput"
            type="password"
            placeholder="give me your password"
            onChange={this.handleChange}
          ></input>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
