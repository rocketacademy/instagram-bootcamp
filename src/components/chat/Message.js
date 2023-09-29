//NOT IN USE

import React from "react";

export default class Message extends React.Component {
  handleCheckboxChange = () => {
    this.props.deleteNote(this.props.id);
  };

  render() {
    return (
      <div className=" w-full bg-yellow-300 text-black shadow-md ">
        <ul>
          <li className="flex items-center justify-between overflow-scroll pl-3 pr-3 pt-1 text-sm hover:bg-yellow-400">
            <div>
              <input
                type="checkbox"
                className="mr-1"
                onChange={this.handleCheckboxChange}
              />
              <span>{this.props.content} </span>
            </div>
            <div>
              <span className="mr-1">{this.props.upvoteCount}</span>
              <button
                className="text-lg leading-none "
                onClick={() => this.props.upvote(this.props.id)}
              >
                ▲
              </button>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
