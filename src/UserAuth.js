import React from "react";
import { auth } from "./firebase";
import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

class UserAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: "",
      Password: "",
      create: false,
    };
  }

  handleInput = (event) => {
    if (event.target.id === "Id") {
      this.setState(() => ({
        Id: event.target.value,
      }));
    } else if (event.target.id === "Password") {
      this.setState(() => ({
        Password: event.target.value,
      }));
    }
  };

  userAuthen = (event) => {
    if (this.state.create === true) {
      createUserWithEmailAndPassword(auth, this.state.Id, this.state.Password)
        .then(
          this.setState(() => ({
            Id: "",
            Password: "",
          }))
        )
        .catch(
          this.setState(() => ({
            Id: "Incorrect Format",
            Password: "",
          }))
        );
    } else {
      signInWithEmailAndPassword(auth, this.state.Id, this.state.Password)
        .then(
          this.setState(() => ({
            Password: "",
          }))
        )
        .catch((err) => window.alert("ggwp"));
    }
  };

  signOut = (event) => {
    signOut(auth);
  };

  changeformstate = (event) => {
    this.setState((prevState) => ({
      create: !prevState.create,
    }));
  };

  render() {
    if (this.props.login === "false") {
      return (
        <div>
          <form>
            <div>
              <label>
                Email:
                <input
                  type="text"
                  id="Id"
                  onChange={this.handleInput}
                  value={this.state.Id}
                />
              </label>
              <br />
              <label>
                Password:
                <input
                  type="password"
                  id="Password"
                  onChange={this.handleInput}
                  value={this.state.Password}
                />
              </label>
            </div>
          </form>
          {this.state.create ? (
            <button onClick={this.userAuthen}>Sign Up</button>
          ) : (
            <button onClick={this.userAuthen}>Sign In</button>
          )}
          <br />
          {this.state.create ? (
            <label
              style={{ color: "cyan", textDecorationLine: "underline" }}
              onClick={this.changeformstate}
            >
              Already have an account? Sign in now!
            </label>
          ) : (
            <label
              style={{ color: "cyan", textDecorationLine: "underline" }}
              onClick={this.changeformstate}
            >
              Create account?
            </label>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <header>
            Welcome {this.state.Id}
            <button style={{ marginLeft: 5 }} onClick={this.signOut}>
              Sign Out
            </button>
          </header>
        </div>
      );
    }
  }
}

export { UserAuth };
