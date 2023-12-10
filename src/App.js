// components
import Textfield from "./Components/Textfield.js";
import Posts from "./Components/Posts.js";
import NavBar from "./Components/NavBar.js";
// react hooks
import { useState, useEffect } from "react";
// firebase
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updateCurrentUser,
} from "firebase/auth";
import { auth } from "./firebase.js";
import "./App.css";
import { FirebaseError } from "firebase/app";

const App = () => {
  const [nameField, setNameField] = useState("");
  const [emailField, setEmailField] = useState("");
  const [passField, setPassfield] = useState("");
  const [user, setUser] = useState("");
  const [screen, setScreen] = useState(false);
  const [displayScreen, setDisplayScreen] = useState(null);
  const [logIn, setLogIn] = useState(true);

  useEffect(() => {
    if (screen === "messages") {
      setDisplayScreen(<Textfield name={user} />);
    } else if (screen === "posts") {
      setDisplayScreen(<Posts name={user} />);
    }
  }, [screen, user]);

  const loadItem = (item) => {
    setScreen(screen === item ? false : item);
  };

  const handleChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleSubmit = (e) => {
    if (logIn) {
      signInWithEmailAndPassword(auth, emailField, passField)
        .then((userCredential) => {
          // Signed in
          setUser(userCredential.user.displayName);
          console.log(auth.currentUser);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    } else {
      createUserWithEmailAndPassword(auth, emailField, passField, nameField)
        .then(() => {
          // Signed up
          setUser(nameField);
          updateProfile(auth.currentUser, {
            displayName: nameField,
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }

    setNameField("");
    setEmailField("");
    setPassfield("");
  };
  return (
    <div className="App">
      {console.log(auth.currentUser)}
      <NavBar />
      <div className="nav">
        <h4 onClick={() => loadItem("messages")}>msgs</h4>
        <h4 onClick={() => loadItem("posts")}>posts</h4>
      </div>
      {screen ? (
        displayScreen
      ) : user === "" ? (
        <header className="App-header row">
          <h4>{logIn ? "Please login below" : "Sign up below"}</h4>
          {!logIn && (
            <div>
              <span>Name: </span>
              <input
                className="login-field"
                type="text"
                value={nameField}
                onChange={(e) => handleChange(e, setNameField)}
              />
            </div>
          )}
          <div>
            <span>Email: </span>
            <input
              className="input-field"
              type="email"
              value={emailField}
              onChange={(e) => handleChange(e, setEmailField)}
            />
          </div>
          <div>
            <span>Password: </span>
            <input
              className="login-field"
              type="password"
              value={passField}
              onChange={(e) => handleChange(e, setPassfield)}
            />
          </div>

          <div>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={() => setLogIn(!logIn)}>
              {logIn ? "Sign up here" : "Login as existing user"}
            </button>
          </div>
        </header>
      ) : (
        <header className="App-header row">
          <h1>Logged in as {user}</h1>
        </header>
      )}
    </div>
  );
};

export default App;
