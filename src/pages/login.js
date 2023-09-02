import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/login.css';

export const Login = () => {
  return (
    <div className="container">
      <div className="login-container">
        <h1>RocketGram</h1>
        <h5>Where rockets are upvotes and crashes are downvotes</h5>
        <Form className="login">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <div className="button-container">
            <Button className="custom-button" type="submit">
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
