import React from "react";

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dateTime: new Date() };
  }
  tick() {
    this.setState({ dateTime: new Date() });
  }

  componentDidMount = () => {
    this.timerID = setInterval(() => this.tick(), 1000);
  };

  componentWillUnmount = () => {
    clearInterval(this.timerID);
  };

  render() {
    return this.state.dateTime.toLocaleString();
  }
}
