import Textfield from "./Components/Textfield.js";
import Posts from "./Components/Posts.js";
import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [userField, setUserField] = useState("");
  const [user, setUser] = useState("");
  const [screen, setScreen] = useState(false);
  const [displayScreen, setDisplayScreen] = useState(null);

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
    setUser(userField);
  };
  return (
    <div className="App">
      <div className="footer-nav">
        <h4 onClick={() => loadItem("messages")}>msgs</h4>
        <h4 onClick={() => loadItem("posts")}>posts</h4>
      </div>
      {screen ? (
        displayScreen
      ) : user === "" ? (
        <header className="App-header row">
          <h4>Please insert your name</h4>
          <input
            className="name-field"
            type="text"
            value={userField}
            onChange={(e) => handleChange(e, setUserField)}
          />
          <button onClick={handleSubmit}>Submit</button>
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
