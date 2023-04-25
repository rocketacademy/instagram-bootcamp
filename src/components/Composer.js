import React, { Component } from "react";

class Composer extends Component {
    handleSubmitAndClose = (e) => {
        this.props.handleSubmit(e);
        this.props.handleClose();
    };
    render() {
        return (
            <form onSubmit={this.handleSubmitAndClose}>
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
