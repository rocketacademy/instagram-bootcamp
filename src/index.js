import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
// import ErrorPage from "./pages/ErrorPage";
// import FeedPage from "./pages/FeedPage";
// import ChatPage from "./pages/ChatPage";
// import LoginPage from "./pages/LoginPage";
// import HomePage from "./pages/HomePage";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <HomePage />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/Chat",
//     element: <ChatPage />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/Settings",
//     element: <LoginPage />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/Feed",
//     element: <FeedPage />,
//     errorElement: <ErrorPage />,
//   },
// ]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );
