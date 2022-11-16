import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import logo from "../logo.png";
import Image from "react-bootstrap/esm/Image";

export function Nav({ loggedInUser, signOutUser }) {
  let userEmail = loggedInUser
    ? `Signed in as: ${loggedInUser.email}`
    : "No user signed in";
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand className="d-flex justify-content-center align-items-center gap-3">
            <Image src={logo} width="40px" rounded />
            RocketGram
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>{userEmail} &nbsp; </Navbar.Text>
            <br></br>
            {loggedInUser != null && (
              <Button variant="success" onClick={signOutUser}>
                Sign out
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
