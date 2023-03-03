import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import sendMe from "../send-me.png";

export default class PostForm extends React.Component {
  render() {
    return (
      <Card key="post-form">
        <Card.Img
          variant="top"
          key={"send-me"}
          src={sendMe}
          alt={"Send me a Rocketgram"}
        />
        <Form className="post-form" onSubmit={this.props.handleSubmit}>
          <Form.Control
            type="file"
            ref={this.props.inputRef}
            onChange={this.props.handleFileChange}
          />
          <Form.Control
            name="message"
            id="message"
            as="textarea"
            rows={2}
            placeholder="Write your message here!"
            value={this.props.message}
            onChange={this.props.handleTextChange}
          />
          <Button variant="primary" type="submit">
            Post
          </Button>
        </Form>
      </Card>
    );
  }
}
