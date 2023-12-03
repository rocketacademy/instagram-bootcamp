import React from "react";
import Feed from "../src/Components/Feed/Feed";
import Chat from "../src/Components/Chat/Chat";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Chat></Chat>
        <Feed>Hello</Feed>
      </div>
    );
  }
}

export default App;
