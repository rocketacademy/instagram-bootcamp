import { useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/login.css';
import { signIn, reAuth } from '../api/authentication';
import { userDetailsContext } from '../utils/userDetailContext';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck } from '../customHooks/reAuth';

export const Login = () => {
  const [userDetails, setUserDetails, , setIsLoggedIn, , setCurrentUser] =
    useContext(userDetailsContext);
  const { email, password } = userDetails;
  const navigate = useNavigate();

  useAuthCheck(reAuth, setIsLoggedIn, setCurrentUser, navigate);

  const signInUser = async () => {
    const user = await signIn(userDetails.email, userDetails.password);
    try {
      if (user) {
        setIsLoggedIn(true);
        setUserDetails({
          email: '',
          password: '',
        });
        navigate('/feed');
      }
    } catch (error) {}
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUserDetails({ ...userDetails, [name]: value });
  };

  return (
    <div className="container">
      <div className="login-container">
        <h1>RocketGram</h1>
        <h5>Where rockets are upvotes and crashes are downvotes</h5>
        <Form className="login">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              value={email}
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
              value={password}
              type="password"
              name="password"
              onChange={(e) => handleChange(e)}
              placeholder="Password"
            />
          </Form.Group>
          <div className="button-container">
            <Button className="custom-button" onClick={signInUser}>
              Login
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
