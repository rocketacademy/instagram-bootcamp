import { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import '../css/login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Register = () => {
  return (
    <div className="container">
      <div className="login-container">
        <h1>RocketGram</h1>
        <h5>Where rockets are upvotes and crashes are downvotes</h5>
        <Form>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">Email</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Email"
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your Email
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="validationCustomUsername">
            <Form.Label>Username</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Username"
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">Password</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Password"
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <div className="button-container">
            <Button className="custom-button" type="submit">
              Register
            </Button>
          </div>
        </Form>
        <div className="existing-user">
          <p> Already address member?</p>
          <a href="/login">Register here </a>
        </div>
      </div>
    </div>
  );
};
