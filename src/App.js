import React from "react";

import "./App.css";
import PictureList from "./Components/PictureList";
import PictureSubmit from "./Components/PictureSubmit";
import MessageSubmit from "./Components/MessageSubmit";
// Save the Firebase message folder name as a constant to avoid bugs due to misspelling



class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      
    };
  }



  

  render() {
   
    return (
      <div className="App">
        <header className="App-header">
          {/* <form onSubmit={this.handleSubmit}>
            <label>
              <input
                type="text"
                name="inputValue"
                value={this.state.inputValue}
                onChange={this.handleChange}
              />
            </label>
            <br />
          </form>

          <ul>{messageListItems}</ul> */}
          <MessageSubmit />
          <PictureSubmit />
          <PictureList />
        </header>
      </div>
    );
  }
}

export default App;
