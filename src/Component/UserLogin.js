import React from "react";

class UserLogin extends React.Component {
  render() {
    return (
      //Input box for user to enter name, Entered name will be registered in current session
      <div>
        <h3>How do we address you?</h3>
        <form onSubmit={this.props.handleNameSubmit}>
          <label>
            <input
              type="text"
              value={this.props.nameInput}
              onChange={this.props.handleNameChange}
            />{" "}
            <input type="submit" value="Enter" />
          </label>
        </form>
      </div>
    );
  }
}

export default UserLogin;
