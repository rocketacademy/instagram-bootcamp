import React from "react";
import ResponsiveAppBar from "./extras/StyledNavbar";
import { Outlet } from "react-router-dom";

function Navbar({ loggedInUser, signOutUser }) {
    return (
        <>
            <ResponsiveAppBar
                loggedInUser={loggedInUser}
                signOutUser={signOutUser}
            />
            <Outlet />
        </>
    );
}

export default Navbar;
