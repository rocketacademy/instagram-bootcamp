import React, { useState, useEffect } from 'react';
import { onChildAdded, ref } from 'firebase/database';
import { database } from './firebase';
import logo from './logo.png';
import './App.css';
import { PostForm } from './components/PostForm';
import { PostsList } from './components/PostsList';
import { Post } from './components/Post';

const DB_MESSAGES_KEY = 'messages';

export const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  useEffect(() => {
    const messagesRef = ref(database, DB_MESSAGES_KEY);
    const handleChildAdded = (data) => {
      setPosts((prevPosts) => [
        ...prevPosts,
        { key: data.key, val: data.val() },
      ]);
    };

    onChildAdded(messagesRef, handleChildAdded);

    return () => {
      // Cleanup function to unsubscribe from Firebase listener
      onChildAdded(messagesRef, handleChildAdded);
    };
  }, [posts]);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <PostForm setMessages={setPosts} />
          <PostsList posts={posts} setPosts={setPosts} />
        </header>
      </div>
    </>
  );
};
