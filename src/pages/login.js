import { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/login.css';
import { useEffect } from 'react';
import { userDetailsContext } from '../utils/userDetailContext';

export const Login = ({ handleChange, signInUser }) => {
  const [userDetails] = useContext(userDetailsContext);
  const { email, password } = userDetails;
  useEffect(() => {
    console.log(userDetails);
  }, [userDetails]);

  return (
    <div className="container">
      <div className="login-container">
        <h1>RocketGram</h1>
        <h5>Where rockets are upvotes and crashes are downvotes</h5>
        <Form className="login">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              // value={email}
              type="email"
              name="email"
              onChange={(e) => handleChange(e)}
              placeholder="Enter email"
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              // value={password}
              type="password"
              name="password"
              onChange={(e) => handleChange(e)}
              placeholder="Password"
            />
          </Form.Group>
          <div className="button-container">
            <Button
              className="custom-button"
              type="submit"
              onClick={signInUser}
            >
              Submit
            </Button>
          </div>
        </Form>
        <div className="new-user">
          <p> Not a member yet? Don't Miss Out! </p>
          <a href="/register">Register here </a>
        </div>
      </div>
    </div>
  );
};
