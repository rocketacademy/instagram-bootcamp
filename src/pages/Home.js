import React, { useuserDetails, useEffect, useContext } from 'react';
import { signIn, reAuth, logOut } from '../api/authentication';
import { Feed } from './Feed';
import { Login } from './Login';
import { userDetailsContext } from '../utils/userDetailContext';

export const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useuserDetails(false);
  const [currentUser, setCurrentUser] = useuserDetails(null);

  const [loading, setLoading] = useuserDetails(false);
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

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUserDetails({ ...userDetails, [name]: value });
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

  return (
    <Login
      handleChange={handleChange}
      userDetails={userDetails}
      signInUser={signInUser}
    />
  );
};
