import React, { Component } from "react";
//import { Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, Routes, Link, Route } from "react-router-dom";
import Error from "./Error";
import MessageSubmit from "./MessageSubmit";
import PictureSubmit from "./PictureSubmit";
import PictureList from "./PictureList";
import Home from "./Home";

class MyNavbar extends Component {
  // constructor(props){
  //   super(props)
  // }
  render() {
    const {name} = this.props;
    return (
      <div>
        {/* <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">My Website</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#services">Services</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar> */}
        <BrowserRouter>
          <div>
            <Link to="/">Home </Link>
            <Link to="/chat">Chat </Link>
            <Link to="/picture/form"> Fruit Form </Link>

            <Link to="/picture/list">Fruit Lists</Link>
          </div>
          <Routes>
            <Route path="/" element={<Home name={name} />} />
            <Route
              path="/chat"
              element={<MessageSubmit displayName={name} />}
            />
            <Route
              path="/picture/form"
              element={<PictureSubmit displayName={name} />}
            />
            <Route path="/picture/list" element={<PictureList />} />

            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default MyNavbar;
