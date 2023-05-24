import React from "react";

class UserLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      nameInput: "",
    };
  }

  handleNameChange = (e) => {
    this.setState({ nameInput: e.target.value });
  };

  handleNameSubmit = (e) => {
    e.preventDefault();
    this.setState({ name: this.state.nameInput });
  };

  render() {
    return (
      //Input box for user to enter name, Entered name will be registered in current session
      <div>
        <h3>How do we address you?</h3>
        <form onSubmit={this.handleNameSubmit}>
          <label>
            <input
              type="text"
              value={this.props.nameInput}
              onChange={this.handleNameChange}
            />{" "}
            <input type="submit" value="Enter" />
          </label>
        </form>
      </div>
    );
  }
}

export default UserLogin;
