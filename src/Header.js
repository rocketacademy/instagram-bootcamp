import React from "react";
import AuthForm from "./AuthForm";
import Upload from "./Upload";
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
            {this.props.loggedInUser && (
              <button onClick={this.toggleUpload}>Upload</button>
            )}
            {this.props.loggedInUser ? (
              this.props.loggedInUser.email
            ) : (
              <button onClick={this.toggleAuthForm}>Sign In</button>
            )}

            {this.props.loggedInUser && (
              <button onClick={this.props.onSignOut}>Sign Out</button>
            )}
          </div>
        </div>
        {this.state.showAuthForm && (
          <AuthForm toggleAuthForm={this.toggleAuthForm} />
        )}
        {this.state.showUpload && <Upload />}
      </div>
    );
  }
}

export default Header;
