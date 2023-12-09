import React from "react";
import AuthForm from "./AuthForm";
import Upload from "./Upload";
import Button from "react-bootstrap/Button";
import { CgAddR } from "react-icons/cg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAuthForm: false,
      showUpload: false,
    };
  }

  toggleAuthForm = () => {
    this.setState((prevState) => ({ showAuthForm: !prevState.showAuthForm }));
  };

  toggleUpload = () => {
    this.setState((prevState) => ({ showUpload: !prevState.showUpload }));
  };

  render() {
    return (
      <div>
        <div className="navbar">
          <h1>Rocketgram</h1>
          <div className="user-navbar">
            {this.props.loggedInUser ? (
              this.props.loggedInUser.email
            ) : (
              <Button onClick={this.toggleAuthForm}>Sign In</Button>
            )}

            {this.props.loggedInUser && (
              <Button onClick={this.toggleUpload}>
                <CgAddR />
              </Button>
            )}

            {this.props.loggedInUser && (
              <Button onClick={this.props.onSignOut}>Sign Out</Button>
            )}
          </div>
        </div>
        {this.state.showAuthForm && (
          <AuthForm toggleAuthForm={this.toggleAuthForm} />
        )}
        {this.state.showUpload && (
          <Upload loggedInUser={this.props.loggedInUser} />
        )}
      </div>
    );
  }
}

export default Header;
