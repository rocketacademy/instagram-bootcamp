import { useState, useEffect } from "react";
import logo from "./logo.png";
import "./App.css";
import Composer from "./Components/Composer";
import NewsFeed from "./Components/NewsFeed";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthForm from "./Components/AuthForm";

function App() {
  const [likeClicked, setLikeClicked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shouldRenderAuthForm, toggleAuthForm] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (loggedInUser) => {
      console.log(loggedInUser);
      if (loggedInUser) {
        toggleAuthForm(false);
        setLoggedInUser(loggedInUser);
      }
    });
  }, []);

  const handleLikeCount = () => {
    setLikeCount((state) =>
      state.likeClicked ? state.likeCount + 1 : state.likeCount - 1
    );
  };

  const handleLikeButton = () => {
    setLikeClicked(
      (state) => !state.likeClicked,
      () => handleLikeCount()
    );
  };

  console.log(loggedInUser);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {!loggedInUser && !shouldRenderAuthForm && (
          <button onClick={() => toggleAuthForm((state) => !state)}>
            Create Account or Sign In
          </button>
        )}

        {shouldRenderAuthForm && <AuthForm />}

        {loggedInUser && <Composer email={loggedInUser.email} />}

        {loggedInUser && (
          <button
            onClick={() => {
              signOut(auth);
              setLoggedInUser(null);
              toggleAuthForm(false);
            }}
          >
            Logout!
          </button>
        )}

        {!shouldRenderAuthForm && <NewsFeed onclick={handleLikeButton} />}
      </header>
    </div>
  );
}

export default App;
