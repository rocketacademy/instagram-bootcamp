import React from 'react'

export default class PrevMessages extends React.Component {
  constructor(props) {
    super(props)

    this.name=props.name
    this.image = props.sprites.front_default
    this.weight = props.weight
  }

  render() {
    return (
      <div>
        <h2>{this.name}</h2>
        <img src={this.image} alt={this.name} />
        <p>{this.weight}</p>
      </div>
    );
  }
}