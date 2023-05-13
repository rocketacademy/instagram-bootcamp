import React from "react";
import { useAuth } from "../../AuthContext";
import { Link } from "react-router-dom";

function Sidebar() {
  const { user } = useAuth();

  function ActiveUser() {
    if (user) {
      <div>
        <div>
          <Link to={`/profile/${user.username}`}>
            <button>
              <img src={user.photoURL} alt="User avatar" />
            </button>
          </Link>
          <div>{user.username}</div>
          <div>{user.status}</div>
          <Link to={`/profile/${user.username}`}>
            <button>View Profile</button>
          </Link>
        </div>
      </div>;
    }
  }

  return (
    <div>
      <ActiveUser />
      <div>
        <Link to={"/users"}>
          <button>All Users</button>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
