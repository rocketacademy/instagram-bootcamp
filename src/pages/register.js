import { useState, useContext } from 'react';
import { register } from '../api/authentication';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { userDetailsContext } from '../utils/userDetailContext';

export const Register = () => {
  const [state, setState] = useState({
    email: '',
    userName: '',
    password: '',
  });

  const [, , , setIsLoggedIn] = useContext(userDetailsContext);

  const navigate = useNavigate();

  const registerUser = async () => {
    const { email, password } = state;
    try {
      const user = await register(email, password);
      console.log({ user });
      setState({
        email: '',
        userName: '',
        password: '',
      });
      setIsLoggedIn(true);
      navigate('/Feed');
    } catch (error) {
      console.log(`failed to register user: ${error}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
                name="email"
                value={state.email}
                placeholder="Email"
                onChange={(e) => handleChange(e)}
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your Email
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrependPassword">
                Password
              </InputGroup.Text>
              <Form.Control
                type="password"
                name="password"
                value={state.password}
                placeholder="Password"
                onChange={(e) => handleChange(e)}
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a password
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <div className="button-container">
            <Button onClick={registerUser} className="custom-button">
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
