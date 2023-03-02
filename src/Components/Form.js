import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default class MainForm extends React.Component {
  render() {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Form.Control
          type="file"
          ref={this.props.inputRef}
          onChange={this.props.handleFileChange}
        />
        <Form.Control
          name="message"
          id="message"
          placeholder="Write your message here!"
          value={this.props.message}
          onChange={this.props.handleTextChange}
        />
        <Button variant="light" type="submit">
          Post
        </Button>
      </Form>
    );
  }
}
