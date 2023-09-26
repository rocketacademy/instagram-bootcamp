import React from "react";
import MessageForm from "./Component/MessageForm";
import MessageList from "./Component/MessageList";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <MessageList />
          <MessageForm />
        </header>
      </div>
    );
  }
}

export default App;
