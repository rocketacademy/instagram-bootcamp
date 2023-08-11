import React, { useState } from "react";
import { Form, Button, Card, Container, Navbar } from "react-bootstrap";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function AuthForm() {
  // const emailRef = useRef();
  // const passwordRef = useRef();
  // const passwordConfirmRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
      setEmail("");
      setPassword("");

      // Only navigate if sign up is successful
      navigate("/");
    } catch (error) {
      // Handle sign up error
      console.log(error);
    }
  };

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      setEmail("");
      setPassword("");

      // Only navigate if sign in is successful
      navigate("/");
    } catch (error) {
      // Handle sign in error
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar>
        <Container>
          <Navbar.Brand href="#home">Welcome to Caleb's IG Clone!</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end"></Navbar.Collapse>
        </Container>
      </Navbar>
      <Container
        className="d-flex align-items-center justify-content-center w-100"
        style={{
          minHeight: "30vh",
          maxWidth: "500px",
        }}
      >
        <div className="w-100">
          <Card>
            <Card.Body>
              {/* <h2 className="text-center mb-4">Sign Up</h2> */}
              <Form>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    // ref={emailRef}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Email here"
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    // ref={passwordRef}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    placeholder="Password here"
                    required
                  ></Form.Control>
                </Form.Group>
                {/* <Form.Group id="password-confirm">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    required
                  ></Form.Control>
                </Form.Group> */}
                <div className="d-flex justify-content-around">
                  <Button
                    className="w-50 text-center mt-2"
                    variant="secondary"
                    onClick={signUp}
                  >
                    Sign Up
                  </Button>
                  <Button className="w-50 text-center mt-2" onClick={signIn}>
                    Sign In
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          {/* <div className="w-100 text-center mt-2">
            Already have an account? Log In
          </div> */}
        </div>
      </Container>
      <Container className="d-flex align-items-center justify-content-center w-100">
        <Link to="/">
          I'll sign in/up later - take me back to the newsfeed.
        </Link>
      </Container>
    </div>
  );
}
