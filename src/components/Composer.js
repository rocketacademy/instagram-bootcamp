import React, { Component } from "react";

class Composer extends Component {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit}>
                <input
                    type="file"
                    value={this.props.fileInputValue}
                    onChange={this.props.handleFileChange}
                ></input>

                <input
                    type="text"
                    value={this.props.message}
                    onChange={this.props.handleChange}
                    name="message"
                    autoComplete="off"
                ></input>
                <button type="submit">Send</button>
            </form>
        );
    }
}

export default Composer;
