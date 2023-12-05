import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="navbar">
        <h1>Rocketgram</h1>
        <div className="user-navbar">
          <p>User: {this.props.loggedInUser.email}</p>
          <button onClick={this.props.onSignOut}>Sign Out</button>
        </div>
      </div>
    );
  }
}

export default Header;
