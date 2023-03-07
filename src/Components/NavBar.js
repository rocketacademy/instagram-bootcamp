import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../logo.png";

export default function NavBar(props) {
  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Navbar.Brand href="#top">
        <img src={logo} className="App-logo" alt="logo" />
      </Navbar.Brand>
      {props.authenticated && !props.loginFormShow && (
        <Nav id="logged-in-nav">
          <NavDropdown
            title={`Welcome, ${props.user.email}`}
            id="collasible-nav-dropdown"
          >
            <NavDropdown.Item onClick={props.signOutUser}>
              Sign out
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      )}
      {!props.authenticated && !props.loginFormShow && (
        <Nav id="signed-out-nav">
          <Nav.Link onClick={props.setLoginFormShow}>
            Log in or sign up to post
          </Nav.Link>
        </Nav>
      )}
    </Navbar>
  );
}
