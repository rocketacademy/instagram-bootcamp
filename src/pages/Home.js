import React, { useState, useEffect, useContext } from 'react';
import { reAuth } from '../api/authentication';
import { Login } from './Login';
import { userDetailsContext } from '../utils/userDetailContext';
import { Navigate, useNavigate } from 'react-router-dom';

export const Home = () => {
  const [loading, setLoading] = useState(false);
  const [, , isLoggedIn, setIsLoggedIn, signInUser, , , setCurrentUser] =
    useContext(userDetailsContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfLoggedIn = (authedUser) => {
      if (authedUser) {
        const { email } = authedUser;
        // * user !== null / undefined, it means the user is signed in
        setCurrentUser(email);
        setIsLoggedIn(true);
        setLoading(false);
      } else {
        setLoading(false);
        // User is signed out
        navigate('/login');
        return null;
      }
    };

    reAuth(checkIfLoggedIn);
  }, [isLoggedIn, setIsLoggedIn, setCurrentUser, navigate]);

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
