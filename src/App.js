import React from "react";
import "./App.css";
import Composer from "./Component/Composer";
import NewsFeed from "./Component/NewsFeed";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>
            {" "}
            <NewsFeed />
            <br />
            <Composer />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
