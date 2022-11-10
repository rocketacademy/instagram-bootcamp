import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "./logo.png";

function NavigationBar({ toggleAuth, userSignOut, currentUser }) {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        <img
          src={logo}
          alt="logo"
          width="60"
          height="60"
          className="d-inline-block align-top"
        />
      </Navbar.Brand>
      <Navbar.Text>{currentUser}</Navbar.Text>
      <Nav>
        {currentUser === "Guest" ? (
          <Nav.Link onClick={toggleAuth}>Sign In</Nav.Link>
        ) : (
          <Nav.Link onClick={userSignOut}>Sign Out</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
}

export default NavigationBar;
