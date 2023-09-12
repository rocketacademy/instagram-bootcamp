import React, { useState, useEffect, useCallback, useContext } from 'react';
import { onChildAdded, ref } from 'firebase/database';
import { database } from '../firebase';
import { PostForm } from '../components/PostForm';
import { PostsList } from '../components/PostsList';
import { userDetailsContext } from '../utils/userDetailContext';
import { toggleContext } from '../components/toggleContext';
import { NavBar } from '../components/Navbar';
import { logOut } from '../api/authentication';
import { useNavigate } from 'react-router-dom';

const DB_MESSAGES_KEY = 'messages';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();

  const [, , isLoggedIn, setIsLoggedIn, , , setCurrentUser] =
    useContext(userDetailsContext);

  const handleSignOut = useCallback(async () => {
    await logOut();
    setIsLoggedIn(false);
    setCurrentUser({});
    navigate('/login');
  }, [setCurrentUser, setIsLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate, isLoggedIn]);

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
        <NavBar handleSignOut={handleSignOut} />
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

export default Feed;
