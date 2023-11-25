import React from "react";
import { push, ref, set } from "firebase/database";
import { database } from "../firebase";

const DB_MESSAGES_KEY = "messages";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialise empty messages array in state to keep local state in sync with Firebase
    // When Firebase changes, update local state, which will update local UI
    this.state = {
      inputValue: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      inputValue: e.target.value,
    });
  };

  writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, this.state.inputValue);
  };

  render() {
    return (
      <form>
        <input
          className="input input-bordered text-slate-900"
          type="text"
          placeholder="Type here"
          value={this.state.inputValue}
          onChange={this.handleChange}
        />
        <div className="btn" onClick={this.writeData}>
          Send
        </div>
      </form>
    );
  }
}
