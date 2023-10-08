import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import { auth } from "../firebase.js";
import { UserContext } from "../App-Hooks.js"

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";

//Functional based components
const Login = (props) => {
  const { setUser, username, setUsername, setIsLoggedIn } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState("0");
  const [systemMsg, setSystemMsg] = useState("");

  const navigate = useNavigate();

  const onChange = (e) => {
    let { id, value } = e.target;
    // Can I use "switch case" here?
    if (id === "email") {
      setEmail(value);
      setSystemMsg("");
    } else if (id === "password") {
      setPassword(value);
      setSystemMsg("");
    } else if (id === "username") {
      setUsername(value);
      setSystemMsg("");
    }
  };

  const onUserRegistration = async (e) => {
    e.preventDefault();

    try {
      // Create user and wait for it to complete
      const userInfo = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with display name
      await updateProfile(auth.currentUser, {
        displayName: username,
      });

      // Set user information and navigate
      setUser(userInfo.user);
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
      navigate("/Feeds");

      console.log("User created and profile updated successfully");
    } catch (error) {
      console.error("Error:", error);
    }

    // createUserWithEmailAndPassword(auth, email, password)
    //   .then((userInfo) => {
    //     console.log(userInfo);

    //     setUser(userInfo.user);
    //     setIsLoggedIn(true);
    //     setEmail("");
    //     setPassword("");


    //   })
    //   .then(() => {
    //     console.log("User created and profile updated successfully");
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });

    // updateProfile(auth.currentUser, {
    //   displayName: username,
    // })

    // navigate("/Feeds");
  };

  const onUserSignIn = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userInfo) => {
        console.log(userInfo);

        setUser(userInfo.user);
        setIsLoggedIn(true);
        setEmail("");
        setPassword("");
        navigate("/Feeds");
      })
      .then(() => {
        console.log("User sign in successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
        setSystemMsg("Invalid Login");
      });
  };

  const onPasswordReset = async (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Email sent");
      });
  };

  const pageDisplay = () => {
    if (stage === "0") {
      return (
        <div >
          <form 
          onSubmit={(e) => onUserSignIn(e)}
          className="flex flex-col justify-between items-center content-center gap-4"
          >
            <input
              type="text"
              id="email"
              placeholder="Input email here"
              onChange={onChange}
              value={email}
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              onChange={onChange}
              value={password}
              className="input input-bordered w-full max-w-xs"
            />
            <p className=" text-red-700 font-semibold">{systemMsg}</p>
            <input type="submit" className="btn" value="Log In" />
          </form>
          <br />
          {/* <hr />
          <button className="btn btn-link" onClick={() => setStage("1")}>
            Forgot password
          </button>
          <br /> */}
          <p>Don't have an account?</p>
          <button className="btn btn-link" onClick={() => setStage("2")}>
            Sign Up
          </button>
        </div>
      );
    } else if (stage === "1") {
      return (
        <div>
          {/* // Forgot password */}
          <form 
          onSubmit={(e) => onPasswordReset(e)}
          className="flex flex-col justify-between items-center content-center gap-4"
          >
            <h2>Trouble logging in?</h2>
            <p>
              Enter your email, phone, or username and we'll send you a link to
              get back into your account.
            </p>
            <br />
            <input
              type="text"
              id="email"
              placeholder="Input email here"
              onChange={onChange}
              value={email}
              className="input input-bordered w-full max-w-xs"
            />
            <input type="submit" className="btn" value="Reset Password"/>
            <br />
          </form>
          <button className="btn btn-link" onClick={() => setStage("0")}>
            Back to Login
          </button>
        </div>
      );
    } else if (stage === "2") {
      return (
        <div>
          {/* Show Sign Up Form */}
          <form 
          onSubmit={(e) => onUserRegistration(e)}
          className="flex flex-col justify-between items-center content-center gap-4"
          >
            <p className=" text-sm">Sign up to see photos and videos from your friends.</p>
            <input
              type="text"
              id="email"
              placeholder="Input email here"
              onChange={onChange}
              value={email}
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="text"
              id="username"
              placeholder="Username"
              onChange={onChange}
              value={username}
              className="input input-bordered w-full max-w-xs"
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              onChange={onChange}
              value={password}
              className="input input-bordered w-full max-w-xs"
            />
            <input type="submit" className="btn" value="Sign Up"/>
          </form>
          <br />
          <button className="btn btn-link" onClick={() => setStage("0")}>
            Back to Login
          </button>
        </div>
      );
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        //User signed in
        console.log(user);
        setUser(user);
        setIsLoggedIn(true);
        navigate('/Feeds');
      } else {
        //No sign in user
        console.log(user);
        setUser({});
        setIsLoggedIn(false);
      };
    });
    //navigate('/Feeds');
  }, []);

  return (
    <div className="h-screen w-auto flex flex-col justify-center text-center content-center gap-8 p-14">
      <h1 className="font-sans text-3xl">
        Rocketgram 🚀
      </h1>
      {pageDisplay()}
    </div>
  )
};

export default Login;
