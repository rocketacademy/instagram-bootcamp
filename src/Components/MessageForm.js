import React from "react";
import { push, ref, set } from "firebase/database";
import { database } from "../firebase";

const DB_MESSAGES_KEY = "messages";

export default class MessageForm extends React.Component {
  constructor(props) {
    super(props);

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
    set(newMessageRef, {
      messageString: this.state.inputValue,
      date: new Date().toLocaleString(),
    });

    this.setState({
      inputValue: "",
    });
  };

  render() {
    return (
      <form className="flex w-full mr-5" onSubmit={this.writeData}>
        <input
          className="w-full mr-2 ml-5 input input-bordered text-slate-900"
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
