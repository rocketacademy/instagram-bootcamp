import React, { useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Chat() {
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
      <Container></Container>
    </div>
  );
}
