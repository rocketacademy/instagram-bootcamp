import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// import components
import InstagramFeed from "./Component/InstagramFeed.js";
import InstagramForm from "./Component/InstagramForm";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedinUser: null,
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <InstagramForm />
        </header>
        <InstagramFeed />
      </div>
    );
  }
}

export default App;
