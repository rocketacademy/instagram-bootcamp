import React from "react";
import Textfield from "./Components/Textfield.js";
import Posts from "./Components/Posts.js";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      nameField: "",
      name: "",
      screen: false,
    };

    this.screens = {
      messages: <Textfield name={this.state.name} />,
      posts: <Posts name={this.state.name} />,
    };
  }

  componentDidUpdate() {
    this.screens = {
      messages: <Textfield name={this.state.name} />,
      posts: <Posts name={this.state.name} />,
    };
  }

  loadItem = (item) => {
    this.setState({
      screen: this.state.screen === item ? false : item,
    });
  };

  handleChange = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  handleSubmit = (e) => {
    this.setState({ name: this.state.nameField });
  };

  render() {
    return (
      <div className="App">
        <div className="footer-nav">
          <h4 onClick={() => this.loadItem("messages")}>msgs</h4>
          <h4 onClick={() => this.loadItem("posts")}>posts</h4>
        </div>
        {this.state.screen ? (
          this.screens[this.state.screen]
        ) : this.state.name === "" ? (
          <header className="App-header row">
            <h4>Please insert your name</h4>
            <input
              className="name-field"
              type="text"
              value={this.state.nameField}
              onChange={(e) => this.handleChange(e, "nameField")}
            />
            <button onClick={this.handleSubmit}>Submit</button>
          </header>
        ) : (
          <header className="App-header row">
            <h1>Logged in as {this.state.name}</h1>
          </header>
        )}
      </div>
    );
  }
}

export default App;
