import React, { useContext } from 'react';
import { userDetailsContext } from '../utils/userDetailContext';

export const NavBar = ({ handleSignOut }) => {
  const [, , , , , currentUser] = useContext(userDetailsContext);
  const { email } = currentUser;
  return (
    <>
      <div>
        <h3> welcome Back {email}</h3>
        <button onClick={handleSignOut}> logout</button>
      </div>
    </>
  );
};
