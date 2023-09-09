import React, { useState, useContext } from 'react';
import { Login } from './Login';
import { userDetailsContext } from '../utils/userDetailContext';
import { Navigate } from 'react-router-dom';

export const Home = () => {
  const [loading, setLoading] = useState(false);
  const [, , isLoggedIn] = useContext(userDetailsContext);

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

  return <Login />;
};
