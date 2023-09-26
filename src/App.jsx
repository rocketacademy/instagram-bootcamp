import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";

import Home from "./pages/Home";
import Insta from "./pages/Insta";
import Register from "./pages/Register";
import Post from "./pages/Post";

//Here, you're defining an array called routes. This array contains objects, and each object represents a route in your web application.
//A route specifies where a particular URL path should lead and what should be displayed when that path is visited.
// path: This is a string that represents the URL path for the route.
// element: This is a React component that should be rendered when the specified path is visited.
const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/insta",
    element: <Insta />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  //The path attribute includes :postId, which is a route parameter to capture the post's unique ID.
  {
    path: "/post/:postId",
    element: <Post />,
  },
];

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* This is a JavaScript expression that maps over the routes array using
          the map function. It processes each route object in the array and
          returns a set of React Route components. */}
          {/* <Route path={route.path} element={route.element} />: This is JSX code
          that defines a React Route component. */}
          {/* It specifies two props for the Route component: 1. path: This prop is set
          to the path property of the current route object, determining the URL
          path for this route. 2. element: This prop is set to the element property 
          of the current route object, specifying the 
          React component to be rendered when this route is visited.*/}
          {routes.map((route) => (
            <Route path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
