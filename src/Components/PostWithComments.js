import { useEffect, useState } from "react";
import PostCard from "./PostCard.js";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../firebase.js";
import { ref, get, child } from "firebase/database";

export default function PostWithComments(props) {
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
        likedUsers: data.val().likedUsers,
      });
      setIsLoading(false);
    });
  };

  return (
    <>
      <Button variant="light" onClick={() => navigate("/")}>
        ↼ Back to feed
      </Button>
      {isLoading ? "Loading..." : <PostCard item={postData} />}
      <br />
      <h1 style={{ color: "#ffffff" }}>Comment section coming soon...</h1>
    </>
  );
}
