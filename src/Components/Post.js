import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database } from "../firebase";
import { ref as databaseRef, get } from "firebase/database";
import { Button } from "react-bootstrap";

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = databaseRef(database, `posts/${id}`);
        const snapshot = await get(postRef);
        if (snapshot.exists()) {
          setPost(snapshot.val());
        } else {
          console.log("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page (news feed)
  };

  if (!post) {
    return <p>Loading post...</p>;
  }

  return (
    <div>
      <p>Author: {post.email}</p>
      <p>Date: {post.date}</p>
      {post.url && (
        <img src={post.url} alt="Post" style={{ maxWidth: "100%" }} />
      )}
      <p>{post.textInput}</p>
      <Button variant="dark" onClick={handleGoBack}>
        Go Back
      </Button>
    </div>
  );
}

export default Post;
