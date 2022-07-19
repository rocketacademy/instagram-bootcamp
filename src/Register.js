import React from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInputValue: "",
      passwordInputValue: "",
    };
  }

  handleEmailInputChange = (e) => {
    this.setState({
      emailInputValue: e.target.value,
    });
  };

  handlePasswordInputChange = (e) => {
    this.setState({
      passwordInputValue: e.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(
      auth,
      this.state.emailInputValue,
      this.state.passwordInputValue
    );

    this.setState({
      emailInputValue: "",
      passwordInputValue: "",
    });
  };

  render() {
    return (
      <div>
        <header>
          <h3>Register here</h3>
          <form onSubmit={this.handleSubmit}>
            <label>
              Email:
              <input
                type="text"
                value={this.state.emailInputValue}
                onChange={this.handleEmailInputChange}
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={this.state.passwordInputValue}
                onChange={this.handlePasswordInputChange}
              />
            </label>
            <br />
            <input type="submit" value="Register!" />
          </form>
        </header>
      </div>
    );
  }
}

export default Register;
