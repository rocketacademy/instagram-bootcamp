import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import logo from "./logo.png";
import { Link } from "react-router-dom";

function NavigationBar({ userSignOut, currentUser }) {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
          <img
            src={logo}
            alt="logo"
            width="60"
            height="60"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Container>
          <Navbar.Text>{currentUser}</Navbar.Text>
          <Nav>
            <Link to="/">Home</Link>
            {currentUser === "Guest" ? (
              <Link to="/authform">Sign-In</Link>
            ) : (
              <Link onClick={userSignOut}>Sign-Out</Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
