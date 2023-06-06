// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import firebase from "firebase/app";
// import "firebase/database";

// const PostDetails = () => {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);

//   useEffect(() => {
//     const fetchPostDetails = async () => {
//       // Fetch post details from Firebase using postId
//       const postRef = firebase.database().ref(`posts/${postId}`);
//       const snapshot = await postRef.once("value");
//       const postData = snapshot.val();

//       setPost(postData);
//     };

//     fetchPostDetails();
//   }, [postId]);

//   if (!post) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>{post.title}</h2>
//       <p>{post.description}</p>
//       {/* Display the rest of the post details */}
//     </div>
//   );
// };

// export default PostDetails;
