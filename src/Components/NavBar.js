import { Link } from "react-router-dom";
import { auth } from "../firebase.js";

import "../App.css";

const LoggedInDisplay = () => {
  return <h4>logged in as {auth.currentUser.displayName}</h4>;
};

const NotLoggedInDisplay = () => {
  return <Link to="/">Click here to login</Link>; //make "here" a link to log in page
};

const NavBar = () => {
  const logOut = () => {
    auth.signOut();
  };

  return (
    <div className="nav">
      <Link className="nav-link" to="/messages">
        Messages
      </Link>
      <Link className="nav-link" to="/posts">
        Posts
      </Link>

      {auth.currentUser === null ? <NotLoggedInDisplay /> : <LoggedInDisplay />}

      <div onClick={logOut}>
        <h4>Log out</h4>
      </div>
    </div>
  );
};

export default NavBar;
