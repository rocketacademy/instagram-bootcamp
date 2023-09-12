import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  lazy,
  Suspense,
} from 'react';
import './css/App.css';

import { userDetailsContext } from './utils/userDetailContext';
const Home = lazy(() => import('./pages/Home.js'));
const Feed = lazy(() => import('./pages/Feed'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

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

  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);

  const isLoggedInMemo = useMemo(() => isLoggedIn, [isLoggedIn]);

  const contextValues = useMemo(
    () => [
      userDetailsMemo,
      setUserDetailsMemo,
      isLoggedInMemo,
      setIsLoggedIn,
      currentUser,
      setCurrentUser,
    ],
    [
      userDetailsMemo,
      setUserDetailsMemo,
      isLoggedInMemo,
      currentUser,
      setCurrentUser,
    ]
  );

  return (
    <div className="App">
      <Router>
        <userDetailsContext.Provider value={contextValues}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </Suspense>
        </userDetailsContext.Provider>
      </Router>
    </div>
  );
};
