import React, { useEffect } from 'react';
import { onChildAdded, ref } from 'firebase/database';
import { database } from '../firebase';
import { Post } from './Post';

const DATABASE_KEY = 'posts';

export const PostsList = ({ posts, setPosts }) => {
  useEffect(() => {
    const postListRef = ref(database, DATABASE_KEY);
    onChildAdded(postListRef, (data) => {
      setPosts((state) => [...state, { key: data.key, val: data.val() }]);
    });
  }, [setPosts]);

  return <ol>{posts.length > 0 ? <Post /> : <p>No posts here</p>}</ol>;
};
