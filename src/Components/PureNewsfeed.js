import React, { useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function PureNewsfeed() {
  return (
    <div>
      <Navbar>
        <Container>
          <Navbar.Brand as={Link} to="/">
            Welcome to Caleb's IG Clone!
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end"></Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        {/* <Newsfeed messages={messages} user={user} isLoggedIn={isLoggedIn} /> */}
      </Container>
    </div>
  );
}
