import React, { useContext, useEffect } from "react";
import { AuthContext, useAuth } from "../../AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Enter() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Enter | Rocketgram";
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  return (
    <div>
      <div>
        <div>Rocketgram Logo</div>
        <h1>Rocketgram</h1>
      </div>
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
}

export default Enter;
