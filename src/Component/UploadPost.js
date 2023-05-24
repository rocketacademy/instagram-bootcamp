import React from "react";

class UploadPost extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handlePostSubmit}>
        {/* message input */}
        <h3>Message</h3>
        <input
          type="text"
          value={this.props.messageInput}
          onChange={this.props.handleMessageChange}
        />{" "}
        <br />
        <br />
        {/* photo upload */}
        <div className="inputContainer">
          <label>
            {this.props.fileInputFileName !== ""
              ? "Change Photo"
              : "Select Photo"}{" "}
            <br />
            <br />
            <i class="fa fa-2x fa-camera"></i>
            <input
              className="inputTag"
              type="file"
              accept="image/png, image/jpg, image/gif, image/jpeg"
              // Set state's fileInputValue to "" after submit to reset file input
              value={this.props.fileInputValue}
              onChange={this.props.handlePhotoUpload}
            />
            <br />
          </label>
        </div>
        <br />
        {this.props.fileInputFileName !== ""
          ? `Photo selected: ${this.props.fileInputFileName}`
          : "No file selected"}
        <br />
        <br />
        <input type="submit" value="Post" />
      </form>
    );
  }
}

export default UploadPost;
