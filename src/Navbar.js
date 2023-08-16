import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import logo from "./logo.png";
import "bootstrap/dist/css/bootstrap.min.css";

class NavbarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Navbar fixed="top" bg="light">
        <Container>
          <Navbar.Brand className="justify-content-start">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Rocket Gram
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {this.props.useremail !== undefined ? (
              <Navbar.Text>Signed in as: {this.props.useremail} </Navbar.Text>
            ) : (
              <Navbar.Text>Signed in as: Guest </Navbar.Text>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default NavbarComponent;
