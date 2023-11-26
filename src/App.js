import React from "react";
import Textfield from "./Components/Textfield.js";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      nameField: "",
      name: "",
    };
  }

  handleChange = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  handleSubmit = (e) => {
    this.setState({ name: this.state.nameField });
  };

  render() {
    return (
      <div className="App">
        {this.state.name.length > 0 ? (
          <Textfield name={this.state.name} />
        ) : (
          <header className="App-header row">
            <h2>Please insert your name</h2>
            <input
              className="name-field"
              type="text"
              value={this.state.nameField}
              onChange={(e) => this.handleChange(e, "nameField")}
            />
            <button onClick={this.handleSubmit}>Submit</button>
          </header>
        )}
      </div>
    );
  }
}

export default App;
