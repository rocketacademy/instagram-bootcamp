import React from "react";
import { push, ref, set } from "firebase/database";
import { database } from "../firebase";

const DB_MESSAGES_KEY = "messages";

export default class MessageForm extends React.Component {
  constructor() {
    super();

    this.state = {
      message: "",
    };
  }

  // Note use of array fields syntax to avoid having to manually bind this method to the class
  writeData = () => {
    const messageListRef = ref(database, DB_MESSAGES_KEY);
    const newMessageRef = push(messageListRef);
    set(newMessageRef, {
      message: this.state.message,
      date: new Date().toLocaleTimeString(),
    });

    this.setState({
      message: "",
    });
  };

  handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <div>
        <input
          type="text"
          name="message"
          value={this.state.message}
          placeholder="Type message here"
          onChange={(e) => this.handleChange(e)}
        />
        <br />
        <button onClick={this.writeData}>Submit</button>
      </div>
    );
  }
}
