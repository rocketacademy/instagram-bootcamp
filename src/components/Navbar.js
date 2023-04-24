import React from "react";
import ResponsiveAppBar from "./extras/StyledNavbar";
import { Outlet } from "react-router-dom";

function Navbar({ loggedInUser }) {
    return (
        <>
            <ResponsiveAppBar loggedInUser={loggedInUser} />
            <Outlet />
        </>
    );
}

export default Navbar;
