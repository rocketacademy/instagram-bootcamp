import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/App.css';
import { Feed } from './pages/Feed';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const routes = [
  {
    path: '/',
    element: <Login />,
  },

  {
    path: '/Feed',
    element: <Feed />,
  },
  {
    path: '/Register',
    element: <Register />,
  },
];

export const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </div>
  );
};
