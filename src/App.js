import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
import { React, useState, useEffect } from "react";
import UserAuth from "./Components/UserAuth";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import MyNavbar from "./Components/MyNavBar";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // user is like state in class components, setUser is like setState
  const [user, setUser] = useState({});

  // useEffect triggers when the particular component re-renders similiar to ComponentDidMount and ComponentDidUpdate in class components
  // As useEffect is only one function instead of two, stricter restrictions are needed
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {isLoggedIn ? <MyNavbar name={user.displayName} /> : null}

        {isLoggedIn ? (
          <button
            onClick={(e) => {
              setIsLoggedIn(false);
              signOut(auth);
              setUser({});
            }}
          >
            Logout!
          </button>
        ) : null}

        {isLoggedIn ? (
          <div></div>
        ) : (
          <div>
            Please set your preferred display name, email and password to sign-up
            <br />
            You may leave the display name field blank if you are signing-in
            <UserAuth />
          </div>
        )}
      </header>

    </div>
  );
}

export default App;
