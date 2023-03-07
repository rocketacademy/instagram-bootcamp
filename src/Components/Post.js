import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../firebase.js";
import { ref, onValue, onChildAdded } from "firebase/database";

export default function Post(props) {
  const [postData, setPostData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  let { postId } = useParams();

  useEffect(() => {
    console.log(postId);
    getPost(postId);
  }, [postId]);

  const getPost = (id) => {
    onValue(
      ref(database, "/messages/" + id),
      (data) => {
        setPostData({
          key: data.key,
          message: data.val().message,
          timestamp: data.val().timestamp,
          fileDownloadURL: data.val().fileDownloadURL,
          authorEmail: data.val().authorEmail,
          authorID: data.val().authorID,
          likes: data.val().likes,
          likedUsers: data.val().likedUsers,
        });

        //   console.log(postData);
        setIsLoading(false);
        // });
      },
      {
        onlyOnce: true,
      }
    );
  };

  const renderPost = (postData) => {
    return (
      <Card key={postData.key}>
        <Card.Img
          variant="top"
          key={`${postData.key}-img`}
          src={postData.fileDownloadURL}
          alt={postData.message}
        />
        <Card.Text key={`${postData.key}-m`} className="message">
          {postData.message}
        </Card.Text>
        <Card.Footer key={`${postData.key}-ft`}>
          <div className="footer-data">
            <div key={`${postData.key}-ts`} className="timestamp">
              {postData.timestamp}
            </div>
            <div className="auth-email">{postData.authorEmail}</div>
          </div>
          <div className="like-postData">
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 350 }}
              overlay={
                <Tooltip key={`${postData.key}-tt`}>
                  {postData.likedUsers
                    ? postData.likedUsers.slice(1).map((user) => (
                        <div className="liked-users" key={user}>
                          {user}
                        </div>
                      ))
                    : null}
                </Tooltip>
              }
            >
              <div className="likes">{postData.likes}</div>
            </OverlayTrigger>
            <Button
              name={postData.key}
              className="like-btn"
              variant="outline-danger"
              // onClick={this.handleLike}
              // disabled={!this.props.authenticated}
              // style={{ color: postData.likeButtonColor }}
            >
              ♥
            </Button>
          </div>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <>
      <Button onClick={() => navigate("/")}>Back</Button>
      {isLoading ? "Loading..." : renderPost(postData)}
    </>
  );
}
