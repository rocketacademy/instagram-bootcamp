import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase";
import { useEffect, useState } from "react";

export const PostDisplayFunction = () => {
  const STORAGE_KEY = "/posts";
  const [posts, setPosts] = useState([]);

  let postListItems = posts.map((post) => (
    <div className="carousel-item">
      <img src={post.val.url} alt={post.val.url} />
    </div>
  ));

  const postsRef = ref(database, STORAGE_KEY);

  useEffect(() => {
    onChildAdded(postsRef, (data) => {
      setPosts((prevPosts) => [
        ...prevPosts,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  return (
    <div className="m-10 h-full carousel carousel-center max-w-md p-4 space-x-4 bg-neutral rounded-box">
      {postListItems}
    </div>
  );
};
