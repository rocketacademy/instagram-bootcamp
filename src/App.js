import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import './css/App.css';
import { Feed } from './pages/Feed';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { userDetailsContext } from './utils/userDetailContext';

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
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });

  const userDetailsMemo = useMemo(() => userDetails, [userDetails]);
  const setUserDetailsMemo = useCallback(
    (details) => setUserDetails(details),
    []
  );

  return (
    <div className="App">
      <Router>
        <userDetailsContext.Provider
          value={[userDetailsMemo, setUserDetailsMemo]}
        >
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </userDetailsContext.Provider>
      </Router>
    </div>
  );
};
