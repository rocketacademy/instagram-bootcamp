import React, { Component } from "react";

class Newsfeed extends Component {
    render() {
        return (
            <ol>
                {this.props.messages.map((message) => (
                    <li key={message.key}>
                        <img
                            src={message.imageURL}
                            alt={message.msg}
                            style={{ width: "200px" }}
                        ></img>
                        <p>{message.msg}</p>
                        <p>Post by: {message.author}</p>
                        <p>
                            timestamp:{" "}
                            {new Date(message.date).toLocaleString("en-SG")}{" "}
                        </p>
                    </li>
                ))}
            </ol>
        );
    }
}

export default Newsfeed;
