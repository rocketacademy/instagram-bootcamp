import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { UserContext } from "../App.js";

export default function PostCard(props) {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!user.email) {
      return;
    }
    navigate(`posts/${e.target.id}`);
  };

  const isLikedByCurrentUser = (item) => {
    return (item.likedUsers || []).includes(user.email);
  };

  return (
    <Card key={props.item.key}>
      <Card.Img
        variant="top"
        key={`${props.item.key}-img`}
        src={props.item.fileDownloadURL}
        alt={props.item.message}
        id={props.item.key}
        onClick={handleClick}
      />
      <Card.Text key={`${props.item.key}-m`} className="message">
        {props.item.message}
      </Card.Text>
      <Card.Footer key={`${props.item.key}-ft`}>
        <div className="footer-data">
          <div key={`${props.item.key}-ts`} className="timestamp">
            {props.item.timestamp}
          </div>
          <div className="auth-email">{props.item.authorEmail}</div>
        </div>
        <div className="like-item">
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 350 }}
            overlay={
              <Tooltip key={`${props.item.key}-tt`}>
                {props.item.likedUsers.slice(1).map((user) => (
                  <div className="liked-users" key={user}>
                    {user}
                  </div>
                ))}
              </Tooltip>
            }
          >
            <div className="likes">{props.item.likedUsers.length - 1}</div>
          </OverlayTrigger>
          <Button
            name={props.item.key}
            className="like-btn"
            variant="outline-danger"
            onClick={
              isLikedByCurrentUser(props.item) ? props.unlike : props.like
            }
            disabled={!user.email}
            style={{
              color: isLikedByCurrentUser(props.item) ? "#ff5151" : "#ffb5b5",
            }}
          >
            ♥
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}
