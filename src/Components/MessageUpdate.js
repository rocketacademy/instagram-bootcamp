import React from "react";
import { ref, update } from "firebase/database";
import { database } from "./../firebase";

class MessageUpdate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: this.props.message,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const messageRef = ref(database, `messages/${this.props.id}`);

    const updatedFields = {
      message: this.state.message,
    };

    update(messageRef, updatedFields)
      .then(() => {
        console.log("Message updated");
        this.props.onUpdateMessage(this.state.message);
      })
      .catch((err) => {
        console.log("Error in deleting data:", err);
      });

    this.props.onHandleComplete();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            name="message"
            type="text"
            value={this.state.message}
            onChange={this.handleChange}
          />
          <input type="submit" value="Done" disabled={!this.state.message} />
        </form>
      </div>
    );
  }
}

export default MessageUpdate;
