import React, { useState, useEffect, useContext } from 'react';
import { signIn, reAuth, logOut } from '../api/authentication';
import { Feed } from './Feed';
import { Login } from './Login';
import { userDetailsContext } from '../utils/userDetailContext';

export const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useContext(userDetailsContext);

  useEffect(() => {
    const checkIfUserLoggedIn = (authedUser) => {
      if (authedUser) {
        setIsLoggedIn(true);
        setLoading(false);
        setCurrentUser(authedUser);
      } else {
        setLoading(false);
        return null;
      }
    };
    setLoading(true);
    reAuth(checkIfUserLoggedIn);
  }, []);

  const signInUser = async () => {
    const user = await signIn(userDetails.email, userDetails.password);

    if (user) {
      setIsLoggedIn(true);
      setUserDetails({
        email: '',
        password: '',
      });
    }
  };

  const handleSignOut = async () => {
    await logOut;
    setIsLoggedIn(false);
    setCurrentUser({});
  };

  if (loading)
    return (
      <div>
        <br />
        <br />
        <br />
        Loading.....
      </div>
    );

  if (isLoggedIn)
    return (
      <div>
        <h1>Welcome back ! {currentUser.email}</h1>
        <Feed />
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    );

  return <Login setUserDetails={setUserDetails} signInUser={signInUser} />;
};
