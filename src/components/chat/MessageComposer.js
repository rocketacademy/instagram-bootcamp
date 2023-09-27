//NOT IN USE

import React from "react";

export default class MessageComposer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      likes: "",
    };
  }

  render() {
    const { message, likes } = this.state;
    return (
      <div>
        <form>
          <input
            type="text"
            id="message"
            value={message}
            placeholder="What are you doing now?"
            onChange={this.props.change()}
          ></input>
          <input
            type="text"
            id="likes"
            value={likes}
            placeholder="like?"
            onChange={this.props.change()}
          ></input>
        </form>
      </div>
    );
  }
}
