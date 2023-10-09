import React from "react";
import { NavLink } from "react-router-dom";

const Footer = (props) => {
  return (
    <footer className="btm-nav">
      <NavLink to="/Feeds" className="text-2xl">
        <i className="fi fi-rr-home"></i>
      </NavLink>
      <NavLink to="/Search" className="text-2xl">
        <i className="fi fi-rr-search"></i>
      </NavLink>
      <NavLink to="/PostUpload" className="text-2xl">
        <i className="fi fi-rr-add"></i>
      </NavLink>
      <NavLink to="/Reels" className="text-2xl">
        <i className="fi fi-rr-video-camera-alt"></i>
      </NavLink>
      <NavLink to="/Profile" className="text-2xl">
        <i className="fi fi-rr-circle-user"></i>
      </NavLink>
    </footer>
  );
};

export default Footer;