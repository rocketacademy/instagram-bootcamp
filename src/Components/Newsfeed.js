import React from "react";
import { Container, Card, Navbar } from "react-bootstrap";

export default function Newsfeed({ messages, user }) {
  const messageListItems = messages.map((message) => (
    <Card key={message.key} style={{ margin: "1.5vh 0", border: "none" }}>
      <div>
        <p>
          {message.val.date}: {message.val.text}{" "}
          <em>by {message.val.author}</em>
        </p>
        <div className="card border-0">
          {message.val.url ? (
            <img
              className="card-img-top border-0"
              src={message.val.url}
              alt={message.val.name}
              style={{ border: "none" }}
            />
          ) : (
            <p>No images</p>
          )}
        </div>
      </div>
    </Card>
  ));
  return (
    <div>
      <Container className="d-flex align-items-center justify-content-center">
        <div
          className="w-100 border-0"
          style={{
            maxWidth: "500px",
            maxHeight: "75vh",
            overflowY: "auto",
            marginBottom: "1vh",
            border: "1px solid #dee2e6",
            borderRadius: "0.25rem",
          }}
        >
          {messageListItems}
        </div>
      </Container>
    </div>
  );
}
