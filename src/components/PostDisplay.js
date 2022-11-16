import { Col, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";

import { LoadingSpinners } from "./LoadingSpinners";

export function PostDisplay({ key, imageLink, authorEmail, text }) {
  return (
    <Col xs={12} sm={6} md={4} lg={3} className="g-3">
      <Card bg="dark" style={{ height: "400px" }} key={key}>
        {imageLink ? (
          <Card.Img
            variant="top"
            src={imageLink}
            style={{ height: "60%", objectFit: "cover" }}
          />
        ) : (
          <Row
            style={{ height: "60%" }}
            className="d-flex justify-content-center align-items-center flex-direction-row gap-3"
          >
            <LoadingSpinners variant="dark" />
          </Row>
        )}

        <Card.Body style={{ color: "white", height: "40%" }}>
          <Card.Text>{text}</Card.Text>
          <Card.Text>{authorEmail}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}
