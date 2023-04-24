import { Paper } from "@mui/material";
import React, { Component } from "react";
import formatDistance from "date-fns/formatDistance";

class Newsfeed extends Component {
    render() {
        return (
            <>
                {this.props.messages.map((message) => (
                    <li key={message.key} style={{ listStyle: "none" }}>
                        <Paper sx={{ p: 2, my: 2 }}>
                            {message.imageURL && (
                                <img
                                    src={message.imageURL}
                                    alt={message.msg}
                                    style={{
                                        display: "block",
                                        maxWidth: "100%",
                                        maxHeight: "30vh",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        marginBottom: "10px",
                                    }}
                                ></img>
                            )}
                            <p>
                                <strong>{message.author}</strong> {message.msg}
                            </p>

                            <h6>
                                {formatDistance(
                                    new Date(message.date),
                                    Date.now()
                                )}{" "}
                                ago
                                {/* {new Date(message.date).toLocaleString(
                                    "en-SG"
                                )}{" "} */}
                            </h6>
                        </Paper>
                    </li>
                ))}
            </>
        );
    }
}

export default Newsfeed;
