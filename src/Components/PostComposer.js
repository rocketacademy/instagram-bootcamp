import React from "react";

export default class PostComposer extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <label
          htmlFor="image-upload"
          className={`image-upload ${this.props.file && "complete"}`}
        >
          <img
            src={`./icons/${this.props.file ? "done.svg" : "camera.svg"}`}
            alt="upload"
          />
        </label>
        <input
          id="image-upload"
          type="file"
          onChange={this.props.handleFileChange}
        />
        <input
          name="input"
          type="text"
          value={this.props.input}
          onChange={this.props.handleChange}
          autoComplete="off"
          placeholder="Type here"
        />

        <input type="submit" value="⬆" />
      </form>
    );
  }
}
