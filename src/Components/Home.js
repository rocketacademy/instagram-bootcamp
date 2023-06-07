import React from "react";
import "../App.css";

export default class Home extends React.Component {
  render() {
    const {name} = this.props;
    return (
      <div>
        <h2>Welcome back {name}</h2>
      </div>
    );
  }
}
