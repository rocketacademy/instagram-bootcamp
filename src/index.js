import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// pages
import App from "./App";
import Posts from "./Pages/Posts.js";
import Messages from "./Pages/Messages.js";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  { path: "/posts", element: <Posts /> },
  { path: "/messages", element: <Messages /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
