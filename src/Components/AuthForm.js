import React from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  signUp = async () => {
    const user = await createUserWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    );
    this.setState({
      email: "",
      password: "",
    });
  };

  signIn = async () => {
    const user = await signInWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    );
    this.setState({
      email: "",
      password: "",
    });
  };

  render() {
    return (
      <form className="flex w-full mr-5" onSubmit={this.writeData}>
        <input
          className="w-full mr-2 ml-5 input input-bordered text-slate-900"
          type="text"
          placeholder="Email"
          value={this.state.email}
          onChange={this.handleEmailChange}
        />
        <input
          className="w-full mr-2 ml-5 input input-bordered text-slate-900"
          type="text"
          placeholder="Password"
          value={this.state.password}
          onChange={this.handlePasswordChange}
        />
        <div className="btn" onClick={this.signUp}>
          Sign Up
        </div>
        <div className="btn" onClick={this.signIn}>
          Sign In
        </div>
      </form>
    );
  }
}
