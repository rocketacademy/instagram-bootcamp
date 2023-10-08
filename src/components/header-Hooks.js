import React from "react";
import { NavLink } from "react-router-dom";

const Header = (props) => {
  return (
    <header className="navbar bg-base-100 text-2xl flex justify-between p-4 border-b">
      <a href="/Feeds" className="font-sans">
        Rocketgram 🚀
      </a>
      <NavLink to="/Messenger">
        <i className="fi fi-rr-comments"></i>
      </NavLink>
    </header>
  );
};

export default Header
