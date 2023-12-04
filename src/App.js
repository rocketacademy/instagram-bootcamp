import React from "react";

import Messenger from "./components/Mesenger";
import "./App.css";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Messenger />
      </header>
    </div>
  );
};

export default App;
