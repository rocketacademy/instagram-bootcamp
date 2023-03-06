import CloseButton from "react-bootstrap/CloseButton";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

export default function LoginForm(props) {
  const handleChange = (e) => {
    let { name, value } = e.target;
    props.onChange(name, value);
  };

  return (
    <Modal {...props} backdrop="static" centered>
      <Modal.Header>
        <Modal.Title>LOGIN / SIGN UP</Modal.Title>
        <CloseButton onClick={props.onHide} />
      </Modal.Header>
      <Modal.Body>
        <Form className="login-form">
          <Form.Group className="login-input">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={props.email}
              onChange={handleChange}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="login-input">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              value={props.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group id="login-buttons">
            <Button variant="primary" id="login" onClick={props.onClick}>
              Existing user | log in
            </Button>
            <Button variant="primary" id="sign-up" onClick={props.onClick}>
              New user | sign up
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
