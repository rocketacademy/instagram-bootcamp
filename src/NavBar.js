import React from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import { auth } from "./firebase";

class NavBar extends React.Component {
  signOut = () => {
    auth.signOut();
  };
  render() {
    return <Button onClick={this.signOut}>Log Out</Button>;
  }
}

export default NavBar;
