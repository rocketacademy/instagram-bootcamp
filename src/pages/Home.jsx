import React, { useState, useEffect } from "react";
import { signIn, reAuth, logOut } from "../api/authentication";
import Insta from "./Insta";
import {
  onChildAdded,
  push,
  ref as databaseRef,
  set,
  get,
} from "firebase/database";
import { database } from "../firebase";

const DB_PROFILE_KEY = "profile-data";
const DB_LOGGED_IN_USER_KEY = "logged_in_user";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  //The loading state is used to indicate whether the authentication check is still in progress.
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    //This declares a function named checkIfLoggedIn which takes a user as an argument.
    //It's used to check if a user is logged in and updates the component's state accordingly.
    const checkIfLoggedIn = (user) => {
      //If there's a user, it means the user is logged in, so it does the following:
      //Sets the isLoggedIn state to true, indicating that the user is logged in.
      //Sets the loading state to false, indicating that the loading process is complete.
      //Sets the user state with the user data.
      if (user) {
        setIsLoggedIn(true);
        setLoading(false);
        // User is signed in, see docs for a list of available properties
        setUser(user);
        console.log("user", user);
      }
      //If there's no user, it means the user is not logged in or signed out, so it does the following:
      //Sets the loading state to false, indicating that the loading process is complete.
      else {
        setLoading(false);
        // User is signed out
        return null;
      }

      const profileListRef = databaseRef(database, DB_PROFILE_KEY);
      onChildAdded(profileListRef, (data) => {
        setProfileData((prevData) => [
          ...prevData,
          { key: data.key, val: data.val() },
        ]);
      });
    };

    //This sets the loading state to true initially, indicating that the component is in the process of loading.
    setLoading(true);
    //Passes the checkIfLoggedIn function as a callback to reAuth.
    //The purpose of this is to listen for changes in the user's authentication state, and when it changes, the checkIfLoggedIn function will be called with the user data (if the user is logged in) or null (if the user is not logged in).
    reAuth(checkIfLoggedIn);
  }, []);

  console.log("signed-in profileData", profileData);

  const signInUser = async () => {
    const user = await signIn(state.email, state.password);
    if (user) {
      setIsLoggedIn(true);
      setState({
        email: "",
        password: "",
      });
      console.log("sign-in user:", user);
    }
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSignOut = async () => {
    await logOut();
    setIsLoggedIn(false);
    setUser({});
  };

  // when first load the page, the logic in the useEffect above is executed
  // while the app is checking if the user is logged in, we will display a loading screen
  if (loading)
    return (
      <div>
        <br />
        <br />
        <br />
        Loading.....
      </div>
    );

  // if the user is already signed in, display the below page
  if (isLoggedIn) {
    const loggedInUserData = {
      username: user.displayName,
      email: user.email,
      profilePicture: user.photoURL,
    };
    const loggedInRef = databaseRef(database, DB_LOGGED_IN_USER_KEY);

    //push(messageListRef);: The push function generates a new reference with a unique key within the location specified by messageListRef.
    //This is typically used to add new data (messages) with an auto-generated key, ensuring each message has a unique identifier
    const newLoggedInRef = push(loggedInRef);

    //The `set` function sets the value of the new reference (in this case, newMessageRef) to a specific value.
    set(newLoggedInRef, loggedInUserData);
    console.log("loggedInUserData", loggedInUserData);

    return (
      <div>
        <h1>Welcome back ! {user.displayName}</h1>
        <Insta />
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    );
  }

  // if the user is NOT signed in, make them sign in
  return (
    <div>
      <h1>Sign In</h1>
      <br />
      <label>Email</label>
      <br />
      <input
        type="text"
        name="email"
        value={state.email}
        placeholder="Enter Email"
        onChange={(e) => handleChange(e)}
      />
      <br />
      <label>Password</label>
      <br />
      <input
        type="password"
        name="password"
        value={state.password}
        placeholder="Enter Password"
        onChange={(e) => handleChange(e)}
      />
      <br />
      <br />
      <button onClick={signInUser}>Sign In</button>
      <br />
      <div>
        Don't have an account ? <a href="/register">Register</a>
      </div>
    </div>
  );
};

export default Home;
