import React, { useState, useEffect, useCallback, useContext } from 'react';
import { onChildAdded, ref } from 'firebase/database';
import { database } from '../firebase';
import { PostForm } from '../components/PostForm';
import { PostsList } from '../components/PostsList';
import { userDetailsContext } from '../utils/userDetailContext';
import { toggleContext } from '../components/toggleContext';

const DB_MESSAGES_KEY = 'messages';

export const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [, , , , , handleSignOut, currentUser] = useContext(userDetailsContext);

  const toggleForm = useCallback(() => {
    setIsFormVisible(!isFormVisible);
  }, [isFormVisible]);

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
      <header className="App-header">
        <h1>{`Welcome back! ${currentUser}`}</h1>
        <toggleContext.Provider value={toggleForm}>
          {isFormVisible && <PostForm setMessages={setPosts} />}
          {isFormVisible === false && (
            <button className="open_form" onClick={toggleForm}>
              Add a post
            </button>
          )}
        </toggleContext.Provider>
        <PostsList posts={posts} setPosts={setPosts} />
      </header>
    </>
  );
};
