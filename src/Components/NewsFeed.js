import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const NewsFeed = ({ messages, deleteMessage, likePost }) => {
  const messageListItemsCards = messages.map((obj) => (
    <Card key={obj.key} className="card-with-bg">
      <Card.Img variant="top" src={obj.val.url} />
      <Card.Body style={{ backgroundColor: "darkgrey" }}>
        <Card.Title style={{ color: "white" }}>
          {obj.val.authorEmail} at {obj.val.date}
        </Card.Title>

        <Card.Text style={{ color: "white" }}>{obj.val.message}</Card.Text>

        {obj.val.numberOfLikes > 0 ? obj.val.numberOfLikes : <p>No Likes</p>}
        <Button
          variant="primary"
          onClick={() => likePost(obj.key)}
          className="buttons"
        >
          <FontAwesomeIcon icon={faHeart} />
        </Button>
        <Button onClick={() => deleteMessage(obj.key)} className="buttons">
          Delete
        </Button>
      </Card.Body>
    </Card>
  ));

  return <ol>{messageListItemsCards}</ol>;
};

export default NewsFeed;
