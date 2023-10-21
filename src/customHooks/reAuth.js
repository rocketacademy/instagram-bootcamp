import { useEffect } from 'react';

export const useAuthCheck = (
  reAuth,
  setIsLoggedIn,
  setCurrentUser,
  navigate
) => {
  useEffect(() => {
    const checkIfLoggedIn = (authedUser) => {
      if (authedUser) {
        const { email } = authedUser;
        console.log(authedUser);
        setCurrentUser(email);
        setIsLoggedIn(true);
        navigate('/feed');
      } else {
        // User is signed out
        return null;
      }
    };

    reAuth(checkIfLoggedIn);
  }, [reAuth, setIsLoggedIn, setCurrentUser, navigate]);
};
