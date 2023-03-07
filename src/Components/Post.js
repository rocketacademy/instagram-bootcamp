import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../firebase.js";
import { ref, get, child } from "firebase/database";

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
    get(child(ref(database), `messages/${id}`)).then((data) => {
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
      setIsLoading(false);
    });
  };

  const renderPost = (postData) => {
    return (
      <div className="post">
        <div className="post-data">
          on {postData.timestamp}, {postData.authorEmail} posted:
        </div>
        <img src={postData.fileDownloadURL} alt={postData.message} />
        <div className="post-message">{postData.message}</div>
        {postData.likes > 0 && (
          <div className="post-likes">
            {postData.likes > 1 ? (
              <div className="post-liked">
                {postData.likes} people liked this:
              </div>
            ) : (
              <div className="post-liked">
                {postData.likes} person liked this:
              </div>
            )}
            {postData.likedUsers.slice(1).map((user) => (
              <div className="liked-users" key={user}>
                {user}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Button variant="light" onClick={() => navigate("/")}>
        ⇐ Take me back
      </Button>
      {isLoading ? "Loading..." : renderPost(postData)}
    </>
  );
}
