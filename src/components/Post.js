import React, { useEffect, useState } from 'react';
import { onValue, ref, getDatabase } from 'firebase/database';

export const Post = () => {
  const [posts, setPosts] = useState([]);
  const database = getDatabase();

  useEffect(() => {
    const postListRef = ref(database, 'posts');
    onValue(postListRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postList = Object.entries(data).map(([key, val]) => ({
          key,
          val,
        }));
        setPosts(postList);
      }
    });

    // Clean up the event listener when component unmounts
    return () => {
      onValue(postListRef, null);
    };
  }, [database]);

  if (posts.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {posts.map((post) => (
        <div key={post.key} className="post_card">
          <h4>{post.val.title}</h4>
          {post.val.url ? (
            <img src={post.val.url} alt={post.val.title} />
          ) : (
            <p>No image provided</p>
          )}
          <p>{post.val.tags}</p>
          <p>{post.val.caption}</p>
        </div>
      ))}
    </>
  );
};
