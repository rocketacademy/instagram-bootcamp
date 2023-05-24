import React from "react";

class Newsfeed extends React.Component {
  render() {
    // Convert messages in state to message JSX elements to render
    let messageListItems = this.props.messages.map((message) => (
      <div>
        <li key={message.key}>
          {/* Render each part of message in separate lines */}
          <span>Name: {message.val.name}</span>
          <br />
          <span>Message: {message.val.message}</span>
          <br />
          <span>DateTime: {message.val.dateTime}</span>
          <br />
          {message.val.url ? (
            <img
              className="postImage"
              src={message.val.url}
              alt={message.val.name}
            />
          ) : (
            <p>No images</p>
          )}
        </li>
        <br />
      </div>
    ));
    return <ol>{messageListItems}</ol>;
  }
}

export default Newsfeed;
