import React from "react";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
//import Login from "./pages/Login-Hooks.js";
import Feeds from "./pages/Feeds.js";
import Search from "../Search.js";
import PostUpload from "../PostUpload-Hooks.js";
import Reels from "../Reels.js";
import Profile from "../Profile.js";
import Messenger from "./pages/Messenger.js";
import ErrorPage from "../ErrorPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Feeds />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/Search",
        element: <Search />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/PostUpload",
        element: <PostUpload />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/Reels",
        element: <Reels />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/Profile",
        element: <Profile />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/Messenger",
        element: <Messenger />,
        errorElement: <ErrorPage />,
    }
]);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <RouterProvider router={router}/>
        //Move Sign in Page buttons and text box to here. 
    }
}