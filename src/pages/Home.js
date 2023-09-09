import React, { useState, useEffect, useContext } from 'react';
import { reAuth } from '../api/authentication';
import { Login } from './Login';
import { userDetailsContext } from '../utils/userDetailContext';
import { Navigate } from 'react-router-dom';

export const Home = () => {
  const [loading, setLoading] = useState(false);
  const [, , isLoggedIn, setIsLoggedIn, signInUser, , , setCurrentUser] =
    useContext(userDetailsContext);

  console.log(reAuth);
  useEffect(() => {
    const checkIfLoggedIn = (authedUser) => {
      const { email } = authedUser;
      if (authedUser) {
        // * user !== null / undefined, it means the user is signed in
        setCurrentUser(email);
        setIsLoggedIn(true);
        setLoading(false);
      } else {
        setLoading(false);
        // User is signed out
        return null;
      }
    };
    setLoading(true);
    reAuth(checkIfLoggedIn);
  }, [isLoggedIn, setIsLoggedIn]);

  if (loading)
    return (
      <div>
        <br />
        <br />
        <br />
        Loading.....
      </div>
    );

  if (isLoggedIn) {
    return <Navigate to="/Feed" />;
  }

  return <Login signInUser={signInUser} />;
};
