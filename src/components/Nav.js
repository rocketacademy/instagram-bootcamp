import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

class Nav extends React.Component {
  render() {
    let userEmail = "";
    if (this.props.loggedInUser != null) {
      userEmail = `Signed in as: ${this.props.loggedInUser.email}`;
    } else {
      userEmail = "No user signed in";
    }

    return (
      <Navbar>
        <Container>
          <Navbar.Brand>RocketGram</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>{userEmail}</Navbar.Text>
            {this.props.loggedInUser != null && (
              <Button variant="success" onClick={this.props.signOutUser}>
                Sign out
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
export default Nav;
