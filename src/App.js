import React, { useState, useEffect } from 'react';
import { onChildAdded, ref } from 'firebase/database';
import { database } from './firebase';
import './App.css';
import { PostForm } from './components/PostForm';
import { PostsList } from './components/PostsList';

const DB_MESSAGES_KEY = 'messages';

export const App = () => {
  const [posts, setPosts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

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
    <div className="App">
      <header className="App-header">
        {isFormVisible && <PostForm setMessages={setPosts} />}
        {isFormVisible === false && (
          <button onClick={toggleForm}>Add a post</button>
        )}
        <PostsList posts={posts} setPosts={setPosts} />
      </header>
    </div>
  );
};
