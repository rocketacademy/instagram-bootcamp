import React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

class Signin extends React.Component {
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
    signInWithEmailAndPassword(
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
          <h3>Sign in here</h3>
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
            <input type="submit" value="Sign In!" />
          </form>
        </header>
      </div>
    );
  }
}

export default Signin;
