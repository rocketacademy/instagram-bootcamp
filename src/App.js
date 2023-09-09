import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import './css/App.css';
import { signIn, logOut } from './api/authentication';
import { Feed } from './pages/Feed';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { userDetailsContext } from './utils/userDetailContext';

const routes = [
  {
    path: '/',
    element: <Home />,
  },

  {
    path: '/Login',
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const userDetailsMemo = useMemo(() => userDetails, [userDetails]);
  const setUserDetailsMemo = useCallback(
    (details) => setUserDetails(details),
    [setUserDetails]
  );
  const handleSignOut = useCallback(async () => {
    await logOut();
    setIsLoggedIn(false);
    setCurrentUser({});
  }, []);

  const signInUser = useCallback(async () => {
    const user = await signIn(userDetails.email, userDetails.password);
    try {
      if (user) {
        setIsLoggedIn(true);
        setUserDetails({
          email: '',
          password: '',
        });
      }
    } catch (error) {}
  }, [userDetails.email, userDetails.password]);
  const isLoggedInMemo = useMemo(() => isLoggedIn, [isLoggedIn]);

  const contextValues = useMemo(
    () => [
      userDetailsMemo,
      setUserDetailsMemo,
      isLoggedInMemo,
      setIsLoggedIn,
      signInUser,
      handleSignOut,
      currentUser,
      setCurrentUser,
    ],
    [
      userDetailsMemo,
      setUserDetailsMemo,
      isLoggedInMemo,
      signInUser,
      handleSignOut,
      currentUser,
      setCurrentUser,
    ]
  );

  return (
    <div className="App">
      <Router>
        <userDetailsContext.Provider value={contextValues}>
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
