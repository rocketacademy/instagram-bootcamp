import React, { useEffect } from 'react';
import { onChildAdded, ref } from 'firebase/database';
import { database } from '../firebase';

const DATABASE_KEY = 'posts';

export const PostsList = ({ posts, setPosts }) => {
  useEffect(() => {
    console.log(posts);
  }, [posts]);

  useEffect(() => {
    const postListRef = ref(database, DATABASE_KEY);
    onChildAdded(postListRef, (data) => {
      setPosts((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, [setPosts]);

  return (
    <ol>
      {posts.length > 0 ? (
        posts.map((post) => (
          <React.Fragment key={post.key}>
            <h2>
              {post.val.title} - added on {post.val.date}
            </h2>
            <p>{post.val.caption}</p>
            {post.val.url ? (
              <img src={post.val.url} alt={post.val.title} />
            ) : (
              <p>no image provided</p>
            )}
          </React.Fragment>
        ))
      ) : (
        <p>No posts here</p>
      )}
    </ol>
  );
};
