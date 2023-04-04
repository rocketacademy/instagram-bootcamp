import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import sendMe from "../send-me.png";

export default function PostForm(props) {
  return (
    <Card key="post-form">
      <Card.Img
        variant="top"
        key={"send-me"}
        src={sendMe}
        alt={"Send me a Rocketgram"}
      />
      <Form className="post-form" onSubmit={props.handleSubmit}>
        <Form.Control
          type="file"
          ref={props.inputRef}
          onChange={props.handleFileChange}
        />
        <Form.Control
          name="message"
          id="message"
          as="textarea"
          rows={2}
          placeholder="Write your message here!"
          value={props.message}
          onChange={props.handleTextChange}
        />
        <Button variant="primary" type="submit">
          Post
        </Button>
      </Form>
    </Card>
  );
}
