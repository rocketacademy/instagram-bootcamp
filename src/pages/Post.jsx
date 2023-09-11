import "../App";
import React, { useEffect, useState } from "react";
//This line imports the useParams hook from the 'react-router-dom' library. It's a React hook that allows you to access URL parameters.
//In your component, you'll use it to get the postId from the URL.
import { useParams, Link } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../firebase";

const DB_POST_KEY = "insta-post";

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = ref(database, `${DB_POST_KEY}/${postId}`);
        const snapshot = await get(postRef);

        if (snapshot.exists()) {
          setPost(snapshot.val());
        } else {
          console.error("Post not found");
        }
      } catch (error) {
        console.error("Error loading post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  console.log("post:", post);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Add a back button to return to the news feed */}
      <Link to="/">Back to News Feed</Link>
      {/* Display post details */}
      <h2>{post.username}'s Post</h2>
      <img
        src={post.url}
        alt="Post Image"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <p>{post.caption}</p>
      <p>Likes: {post.likes}</p>
    </div>
  );
};

export default Post;
