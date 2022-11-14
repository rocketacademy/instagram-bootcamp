import Card from "react-bootstrap/Card";

const Postcards = ({ messages }) => {
  return messages.map((message) => (
    <Card className="post-cards" key={message.key} style={{ width: "30vw" }}>
      <Card.Img variant="top" src={message.val.imageURL} />
      <Card.Body>
        <Card.Text>
          {message.val.user}:{message.val.userMessage}
        </Card.Text>
      </Card.Body>
      <Card.Footer>{new Date(message.val.date).toLocaleString()} </Card.Footer>
    </Card>
  ));
};

export default Postcards;
