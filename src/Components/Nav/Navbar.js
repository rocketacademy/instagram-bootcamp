import React from "react";
import { useAuth } from "../../AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="navbar-ctn">
      <div className="navbar-left">
        <div>Logo</div>
        <div>Rocketgram</div>
      </div>
      <div className="navbar-right">
        <Link to={"/login"}>
          <button onClick={() => logout()}>Logout</button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
