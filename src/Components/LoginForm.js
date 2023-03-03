import React from "react";
import CloseButton from "react-bootstrap/CloseButton";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

export default class LoginForm extends React.Component {
  handleChange = (e) => {
    let { name, value } = e.target;
    this.props.onChange(name, value);
  };

  render() {
    return (
      <Modal {...this.props} backdrop="static" centered>
        <Modal.Header>
          <Modal.Title>LOGIN / SIGN UP</Modal.Title>
          <CloseButton onClick={this.props.onHide} />
        </Modal.Header>
        <Modal.Body>
          <Form className="login-form">
            <Form.Group className="login-input">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={this.props.email}
                onChange={this.handleChange}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="login-input">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={this.props.password}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group id="login-buttons">
              <Button
                variant="primary"
                id="login"
                onClick={this.props.handleClick}
              >
                Existing user | log in
              </Button>
              <Button
                variant="primary"
                id="sign-up"
                onClick={this.props.onClick}
              >
                New user | sign up
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
