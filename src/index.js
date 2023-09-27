import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./pages/ErrorPage";
import FeedPage from "./pages/FeedPage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Chat",
    element: <ChatPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Settings",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/Feed",
    element: <FeedPage />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
