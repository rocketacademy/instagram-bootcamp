//-----------React-----------//
import React from "react";
//-----------Components-----------//
// import NavBar from "./components/NavBar";
// import Header from "./components/Header";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import FeedPage from "./pages/FeedPage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

//-----------Firebase-----------//
//-----------Styling-----------//
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <RouterProvider router={router} />;
  }
}

export default App;
