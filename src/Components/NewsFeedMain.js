import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { database, storage } from "../firebase";
import { ref, onChildAdded } from "firebase/database";

const NewsFeedMain = ({ messages, deleteMessage, likePost, isLoggedIn }) => {
  // const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   const messagesRef = ref(database, "messages");

  //   onChildAdded(messagesRef, (snapshot) => {
  //     const newData = { key: snapshot.key, val: snapshot.val() };
  //     setMessages((prevMessages) => [...prevMessages, newData]);
  //   });
  // }, []);

  console.log(messages);

  const messageListItemsCards = messages.map((obj) => (
    <Card key={obj.key} className="card-with-bg">
      <Card.Img variant="top" src={obj.val.url} />
      <Card.Body style={{ backgroundColor: "darkgrey" }}>
        <Card.Title style={{ color: "white" }}>
          {obj.val.authorEmail} at {obj.val.date}
        </Card.Title>

        <Card.Text style={{ color: "white" }}>{obj.val.message}</Card.Text>

        {obj.val.numberOfLikes > 0 ? obj.val.numberOfLikes : <p>No Likes</p>}

        {isLoggedIn ? (
          <Button
            variant="primary"
            onClick={() => likePost(obj.key)}
            className="buttons"
          >
            <FontAwesomeIcon icon={faHeart} />
          </Button>
        ) : (
          <div></div>
        )}

        <Button onClick={() => deleteMessage(obj.key)} className="buttons">
          Delete
        </Button>
      </Card.Body>
    </Card>
  ));

  return <ol>{messageListItemsCards}</ol>;
};

export default NewsFeedMain;
