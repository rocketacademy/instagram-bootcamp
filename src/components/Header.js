//-----------React-----------//
import React from "react";
import { NavLink } from "react-router-dom";

export default class Header extends React.Component {
  render() {
    return (
      <div className="fixed top-0 w-screen">
        <NavLink
          to="/"
          className="font-fontspring flex h-auto items-center justify-center bg-slate-100 text-[40px] opacity-90"
        >
          Rocketgram 🚀
        </NavLink>
      </div>
    );
  }
}
