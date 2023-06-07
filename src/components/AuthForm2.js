import React, { useState } from 'react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  // Declare a new state variable, which we'll call "count"
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const [messageLog, setMessageLog] = useState("");
  const [errorMsg, setErrorMsg] = useState(0);

  const navigate = useNavigate();
  
  // Use a single method to control email and password form inputs
  const handleInputChangeEmail = (e) => {
    setEmailInputValue(e.target.value); //corresponding to the state name from the fields
  };
  const handleInputChangePass = (e) => {
    setPasswordInputValue(e.target.value); //corresponding to the state name from the fields
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const closeAuthForm = () => {
        // Reset auth form state
        setEmailInputValue("");
        setPasswordInputValue("");
        setIsNewUser(true);
        };

// Authenticate user on submit
if (isNewUser) {
    createUserWithEmailAndPassword( //This will handle the user creation
      auth,
      emailInputValue,
      passwordInputValue
    )
      .then(closeAuthForm) //Once authenticated, it will close
      .catch((error) => {
          // Login error, handle the error
          const errorCode = error.code;
          // const errorMessage = error.message;
          // console.log('Creation error: ', errorCode, errorMessage);
          setMessageLog('Creation error:' + errorCode);
          setErrorMsg(2);
        });
  } 
  
  else {
    signInWithEmailAndPassword(auth,emailInputValue,passwordInputValue)
    .then((userCredential) => { //This will handle the existing user sign-in
      // Login successful, handle the authenticated user
      const user = userCredential.user;
      // console.log('Logged in user: ', user);
      setMessageLog('Successfully logged-in!: ' + user);
      setErrorMsg(1);
      navigate("/"); //navigate to home
    })
    .then(closeAuthForm) //Once authenticated, it will close
    .catch((error) => { 
      // Login error, handle the error
      const errorCode = error.code;
      // const errorMessage = error.message;
      // console.log('Login error: ', errorCode, errorMessage);
      setMessageLog('Login error: ' + errorCode);
      setErrorMsg(2);
    });
  }
};

    const toggleNewOrReturningAuth = () => {
        setIsNewUser(!isNewUser)
    };


    return (
        <div>
   
          <p>Sign in with this form to post.</p>
  
          <form onSubmit={handleSubmit}>
            <label>
              <span>Email: </span>
              <input
                type="email"
                name="emailInputValue"
                value={emailInputValue}
                onChange={handleInputChangeEmail}
              />
            </label>
            <br />
  
            <label>
              <span>Password: </span>
              <input
                type="password"
                name="passwordInputValue"
                value={passwordInputValue}
                onChange={handleInputChangePass}
              />
            </label>
  
            <br />
  
            <input
              type="submit"
              value={isNewUser ? "Create Account" : "Sign In"}
              // Disable form submission if email or password are empty
              // Apparently you can do that when using a boo lean operator on string
              disabled={
                !emailInputValue || !passwordInputValue
              }
            />
            <br />
            <button onClick={toggleNewOrReturningAuth}>
              {isNewUser
                ? "If you have an account, click here to login"
                : "If you are a new user, click here to create account"}
            </button>
  
          </form>
  
          <div >
          <p className = {errorMsg === 1 ? 'msgLog' : 'errorLog'}>
            {(errorMsg !==0 ) ? `${messageLog}` : null}
          </p>
          </div>
          
        </div>
      );
    }

////////////////////////////////////////////////////////////////////////
