import { useContext } from "react";
import AuthContext from "./AuthContext";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { user, handleSignOut } = useContext(AuthContext);

  const renderAuthLinks = () => {
    if (user) {
      return (
        <>
          <span style={{ marginRight: "10px" }}>{user.email}</span>

          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Link to="/authform">Create Account Or Sign In</Link>
        </>
      );
    }
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand className="brand" href="/">
          Rocketgram
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <div className="auth-links">{renderAuthLinks()}</div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

//  <Navbar bg="light" expand="lg">
//    <Container>
//      <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
//      <Navbar.Toggle aria-controls="basic-navbar-nav" />
//      <Navbar.Collapse id="basic-navbar-nav">
//        <Nav className="me-auto">
//          <Nav.Link href="#home">Home</Nav.Link>
//          <Nav.Link href="#link">Link</Nav.Link>
//          </Nav>
//      </Navbar.Collapse>
//    </Container>
//  </Navbar>;
