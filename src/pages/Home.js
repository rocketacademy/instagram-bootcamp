import React, { useState, useContext, lazy } from 'react';
import { userDetailsContext } from '../utils/userDetailContext';
import { Navigate } from 'react-router-dom';
// import { Login } from '../pages/Login';

const Login = lazy(() => import('./Login'));
const Home = () => {
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

export default Home;
