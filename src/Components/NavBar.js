import { Link } from "react-router-dom";

export const NavBar = (props) => {
  return (
    <>
      <ul>
        {!props.loggedInUser ? (
          <li className="btn p-2 m-2">
            <Link to="/login">Login/Sign Up</Link>
          </li>
        ) : (
          <div className="btn p-2 m-2" onClick={props.signOut}>
            Sign Out
          </div>
        )}
      </ul>
    </>
  );
};
